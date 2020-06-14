<template lang='pug'>
#el_tileset_image.full.flex-col
  #toolbar.center
    ui-tooltip(text='Zoom Out')
      faicon.icon.toolbar-icon(
        icon='search-minus'
        @mousedown='on_zoom_out'
      )
    .space
    ui-tooltip(text='Zoom In')
      faicon.icon.toolbar-icon(
        icon='search-plus'
        @mousedown='on_zoom_in'
      )
    .space
    ui-tooltip(text='Toggle Grid')
      ui-icon.toolbar-icon(
        icon='grid'
        height='12px'
        text base
        @mousedown='toggle_grid'
      )
    .space
    ui-tooltip(text='Toggle Dim')
      faicon.icon.toolbar-icon(
        icon='adjust'
        @mousedown='toggle_dim'
      )
    .space
    ui-tooltip(text='Save')
      faicon.icon.toolbar-icon(
        icon='save'
        @mousedown='on_save'
      )
  #image-container.expand.flex.overflow-auto
    canvas#canvas.no-shrink.block.margin-auto(ref='canvas')
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'
import * as PIXI from 'pixi.js'
import { anim_block_type, tile_mode, terra_shape_type } from '../const.js'
import { bus } from './editor_tileset.vue'
import { get_json } from './new_tileset.vue'

let fs = require('fs')
let path = require('path')
let { dialog } = require('electron').remote

let app, im, grid, sel, cur, flags, cur_flag, coll // pixi graphics
let colls = []     // pixi graphics for collisions, each el is { u, ur, r, dr, d, dl, l, ul }
let flag = []      // array of pixi graphics flags
let ix, iy         // current tile mouse is over
let nx, ny         // number of tiles along x, y
let mw, mh, tw, th // image width / height, tile width / height
let isx, isy       // sel x and y positions (column, row)
let icx, icy       // auto-tile top-left position (column, row)
let s = 1          // scale factor for image
let o

// for collision arrows
let coll_radius = 1.5
let coll_sq_dim = 2
let coll_coords = []
for (let i = 0; i < 8; i++){
  let a = 45*i*Math.PI/180
  coll_coords[i] = {
    x: .35*Math.cos(a),
    y: .35*Math.sin(a),
  }
}
let i2dir = ['r','dr','d','dl','l','ul','u','ur']
let colls_init = false
  , coll_tile = null
  , curr_coll = null
  , ncolls = coll_coords.length+1

// draws a box for pixi graphics `g` with width `w`, height `h`
function draw_box(g, w, h){
  g.clear()
  g.lineStyle(4, 0x000000)
  g.beginFill(0xffffff, 0)
  g.drawRect(0, 0, w, h)
  g.lineStyle(2, 0x5c99d6)
  g.beginFill(0xffffff, 0)
  g.drawRect(0, 0, w, h)
  g.endFill()
}

export default
{
  name: 'ed_tileset_image',

  // data(){
  //   return {
  //     pub: process.env.BASE_URL,
  //   }
  // },

  props: {
    o: {},
  },

  computed:{
    iflag(){ return this.o.iflag },
    iterra(){ return this.o.iterra },
    terra_1d_pos(){
      if (this.o.iterra === null) return null
      return this.o.terra[this.o.iterra].pos.y * nx + this.o.terra[this.o.iterra].pos.x
    },
    terra_shape(){
      if (this.o.iterra === null) return null
      return this.o.terra[this.o.iterra].shape
    },
    sec(){ return this.o.sec },
  },

  watch: {
    iflag(v){
      // update flags for all tiles
      let ntiles = nx*ny
      for (let i = 0; i < ntiles; i++)
        flag[i].visible = (v === null) ? false : o.flags[v][i]
    },
    terra_1d_pos(){
      let vis = (o.iterra !== null)
      sel.visible = vis
      if (!vis) return
      sel.x = s*tw*o.terra[o.iterra].pos.x
      sel.y = s*th*o.terra[o.iterra].pos.y
    },
    terra_shape(){
      let w, h
      if (this.terra_shape === terra_shape_type._4x3)
        w = 3, h = 4
      else if (this.terra_shape === terra_shape_type._5x1)
        w = 1, h = 5
      sel.clear()
      cur.clear()
      draw_box(sel, w*s*tw, h*s*th)
      draw_box(cur, w*s*tw, h*s*th)
    },
    sec(i, iprev){
      if ( i === tile_mode.props
       || (i === tile_mode.terra && o.iterra !== null)
       ||  i === tile_mode.coll
      )
        sel.visible = true
      if (i === tile_mode.anim)
        sel.visible = false
      this.upd_boxes()
      if (i === tile_mode.flags || iprev === tile_mode.flags)
        this.upd_flags()
      if (i === tile_mode.coll || iprev === tile_mode.coll)
        this.upd_colls()
    }
  },

  methods: {
    ...mapMutations([
      'insert',
      'flip',
      'push',
      'set_prop',
    ]),

    on_click(e){
      switch (o.sec){
        case tile_mode.flags:
          if (o.iflag === null) return
          let i = iy*nx+ix
          this.flip([o.flags[o.iflag], i])
          flag[i].visible = o.flags[o.iflag][i]
          return
        case tile_mode.props:
          isx = ix, isy = iy
          sel.x = isx*s*tw, sel.y = isy*s*th
          this.set_prop([o, 'itile', isy*nx+isx])
          break
        case tile_mode.terra:
          if (o.iterra === null) return
          if (this.terra_shape === terra_shape_type._4x3)
            icx = ix-1, icy = iy-2
          else if (this.terra_shape === terra_shape_type._5x1)
            icx = ix, icy = iy-2
          sel.x = icx*s*tw, sel.y = icy*s*th
          this.set_prop([o.terra[o.iterra].pos, 'x', icx])
          this.set_prop([o.terra[o.iterra].pos, 'y', icy])
          break
        case tile_mode.anim:
          if (o.ianim !== null){
            let block_type = o.anims[o.ianim].block_type
            if (block_type !== anim_block_type.not_set && block_type !== anim_block_type.tile)
              return
            this.set_prop([o.anims[o.ianim], 'block_type', anim_block_type.tile])
            let i = iy*nx+ix
            this.insert([o.anims[o.ianim].tiles, o.anim_pos, i])
            bus.$emit('add_tile_anim', i)
          }
          break
        case tile_mode.coll:
          if (curr_coll%ncolls === ncolls-1){ // clicked on the square
            // if any circle is on, turn all off
            let any_on = false
            for (let ic = 0; ic < ncolls-1; ic++){
              if (o.colls[coll_tile][i2dir[ic]] === true){
                any_on = true
                break
              }
            }
            let state = !any_on
            let ii = Math.floor(curr_coll/ncolls)*ncolls
            for (let ic = 0; ic < ncolls-1; ic++){
              let dir = i2dir[ic]
              this.set_prop([o.colls[coll_tile], dir, state])
              colls[ii+ic].alpha = (o.colls[coll_tile][dir]) ? 1 : .5
            }
          }
          else if (curr_coll !== null){
            let dir = i2dir[curr_coll%ncolls]
            this.flip([o.colls[coll_tile], dir])
            colls[curr_coll].alpha = (o.colls[coll_tile][dir]) ? 1 : .5
          }
          break
      }
    },

    on_mousemove(e){
      ix = Math.floor(e.offsetX/(s*tw))
      iy = Math.floor(e.offsetY/(s*th)) 
      switch (this.sec){
        case tile_mode.flags:
          cur_flag.x = s*ix*tw
          cur_flag.y = s*iy*th
          break
        case tile_mode.props:
        case tile_mode.anim:
          cur.x = s*tw*ix
          cur.y = s*th*iy
          break
        case tile_mode.terra:
          if (this.terra_shape === terra_shape_type._4x3)
            cur.x = s*tw*(ix-1), cur.y = s*th*(iy-2)
          else if (this.terra_shape === terra_shape_type._5x1)
            cur.x = s*tw*ix, cur.y = s*th*(iy-2)
          break
        case tile_mode.coll:
          // reset previous tile coll circles
          if (coll_tile !== null){
            let ii = coll_tile*ncolls 
            for (let ic = 0; ic < ncolls; ic++)
              colls[ii+ic].tint = 0x5c99d6
          }
          // check if we are hovering over any coll graphic
          let xp = e.offsetX%(s*tw)/(s*tw)-.5
            , yp = e.offsetY%(s*th)/(s*th)-.5
          coll_tile = iy*nx+ix
          let ii = coll_tile*ncolls 
          let cr2 = Math.pow(coll_radius/tw,2)
          curr_coll = null
          // check circles
          for (let ic = 0; ic < ncolls-1; ic++)
            if ((Math.pow(xp-coll_coords[ic].x,2) + Math.pow(yp-coll_coords[ic].y,2)) <= cr2){
              colls[ii+ic].tint = 0xd6b85c
              curr_coll = ii+ic
              break
            }
          // check center square
          if (Math.abs(xp) <= coll_sq_dim/tw/2 && Math.abs(yp) <= coll_sq_dim/th/2){
            colls[ii+ncolls-1].tint = 0xd6b85c
            curr_coll = ii+ncolls-1
          }
          break
      }
    },

    // make cursor disappear when mouse exits canvas
    on_mouseout(){
      if (o.sec == tile_mode.flags)
        cur_flag.visible = false
      if ( o.sec == tile_mode.props
        || o.sec == tile_mode.terra
        || o.sec == tile_mode.anim
      ) cur.visible = false
    },
    on_mouseenter(){
      if (o.sec == tile_mode.flags && o.iflag !== null)
        cur_flag.visible = true
      if ( o.sec == tile_mode.props
        || (o.sec == tile_mode.terra && o.iterra !== null)
        || (o.sec == tile_mode.anim && o.ianim !== null && o.anims[o.ianim].block_type !== anim_block_type.terra)
      ) cur.visible = true
    },

    on_save(){
      if (o.file === null){
        dialog.showSaveDialog({
          defaultPath: path.dirname(o.fpath),
        }).then(({canceled, filePath}) => {
          if (!canceled){
            console.log('writing json file')
            fs.writeFileSync(filePath, get_json(o))
          }
        })
      }
    },

    on_zoom_out(){
      if (s <= .25) return // min zoom
      s /= 2
      if (s >= 1)
        s = Math.round(s)
      o.zoom = s
      this.resize_image()
    },
    on_zoom_in(){
      if (s >= 4) return // max zoom
      s *= 2
      if (s >= 1)
        s = Math.round(s)
      o.zoom = s
      this.resize_image()
    },

    resize_image(){
      let npx = Math.round(s*mw)
      let npy = Math.round(s*mh)
      this.$refs.canvas.width = npx
      this.$refs.canvas.height = npy
      app.view.style.width = `${npx}px`
      app.view.style.height = `${npy}px`
      im.scale = {x:s, y:s}
      this.upd_all()
    },

    toggle_dim(){
      im.tint = (im.tint === 0xffffff) ? 0x888888 : 0xffffff
      o.dim = (im.tint !== 0xffffff)
    },
    toggle_grid(){
      grid.visible = !grid.visible
      o.grid = grid.visible
    },

    upd_grid(){
      grid.clear()
      grid.position.set(0, 0)
      grid.lineStyle(1, 0xffffff)
      for (let i = 1; i < nx; i++)
        grid.moveTo(s*tw*i, 0).lineTo(s*tw*i, s*mh+1)
      for (let i = 1; i < ny; i++)
        grid.moveTo(0, s*th*i).lineTo(s*mw+1, s*th*i)
      grid.alpha = .15
    },

    upd_all(){
      // in the update functions, we redraw the graphics instead of simply scaling them because we want to make the
      // graphics "fill" section larger but keep the borders the same width
      this.upd_grid()
      this.upd_boxes()
      this.upd_flags()
      this.upd_colls()
    },

    upd_boxes(){
      sel.clear()
      cur.clear()
      if (o.sec == tile_mode.flags)
        return
      let w, h
      if (o.sec == tile_mode.props){
        sel.x = s*tw*isx, sel.y = s*th*isy
        w = 1, h = 1
      }
      if (o.sec == tile_mode.anim){
        sel.x = s*tw*isx, sel.y = s*th*isy
        w = 1, h = 1
        if (o.ianim === null)
          sel.visible = false, cur.visible = false
      }
      if (o.sec == tile_mode.terra){
        sel.x = s*tw*icx, sel.y = s*th*icy
        if (this.terra_shape === terra_shape_type._4x3)
          w = 3, h = 4
        else if (this.terra_shape === terra_shape_type._5x1)
          w = 1, h = 5
        if (o.iterra === null)
          sel.visible = false, cur.visible = false
      }
      draw_box(sel, w*s*tw, h*s*th)
      draw_box(cur, w*s*tw, h*s*th)
      cur.alpha = .5
    },

    upd_colls(){
      coll.visible = (o.sec === tile_mode.coll)
      if (colls_init === false){
        coll.clear()
        let i = 0
        for (let yi = 0; yi < ny; yi++){
          for (let xi = 0; xi < nx; xi++){
            let x = s*(xi+.5)*tw, y = s*(yi+.5)*th
            // draw circles for collisions for different directions
            for (let ic = 0; ic < ncolls-1; ic++){
              colls[i].clear()
              colls[i].beginFill(0xffffff, 1)
              colls[i].drawCircle(x+tw*s*coll_coords[ic].x,
                y+th*s*coll_coords[ic].y, s*coll_radius)
              colls[i].alpha = (o.colls[yi*nx+xi][i2dir[ic]]) ? 1.0 : .5
              colls[i].tint = 0x5c99d6
              coll.addChild(colls[i])
              i++
            }
            // draw the center square
            colls[i].clear()
            colls[i].beginFill(0xffffff, 1)
            colls[i].drawRect(x-s*coll_sq_dim/2, y-s*coll_sq_dim/2,
              s*coll_sq_dim, s*coll_sq_dim)
            colls[i].alpha = .5
            colls[i].tint = 0x5c99d6
            coll.addChild(colls[i])
            i++
          }
        }
      }
      else
        coll.scale = {x:s, y:s}
    },

    upd_flags(){
      flags.visible = (o.sec === tile_mode.flags)
      cur_flag.clear()
      cur_flag.lineStyle(1, 0x000000)
      cur_flag.beginFill(0x5c99d6, 1)
      cur_flag.drawCircle(s*.5*tw, s*.5*th, s*4)
      cur_flag.alpha = .5
      cur_flag.visible = false
      for (let ix = 0; ix < nx; ix++){
        for (let iy = 0; iy < ny; iy++){
          let i = iy*nx+ix
          flag[i].clear()
          flag[i].lineStyle(1, 0x000000)
          flag[i].beginFill(0x5c99d6, 1)
          flag[i].drawCircle(s*(ix+.5)*tw, s*(iy+.5)*th, s*4)
          if (o.iflag === null ||
              o.flags[o.iflag][i] === false)
            flag[i].visible = false
          flags.addChild(flag[i])
        }
      }
    },
  },

  created(){
    o = this.o
    mw = o.im_w
    mh = o.im_h
    tw = o.tile_w
    th = o.tile_h
    nx = Math.round(mw/tw)
    ny = Math.round(mh/th)
    isx = 0
    isy = 0
    icx = 0
    icy = 0
  },

  mounted(){
    // let tex = PIXI.Texture.from(`${this.pub}hummingbird.png`)
    
    this.$refs.canvas.style.width = `${Math.round(s*mw)}px`
    this.$refs.canvas.style.height = `${Math.round(s*mh)}px`

    app = new PIXI.Application({
      width: s*mw,
      height: s*mh,
      view: this.$refs.canvas,
      antialias: true,
    })

    let base = PIXI.BaseTexture.fromBuffer(o.im_data, mw, mh)

    // extract tiles
    o.g_tiles = [] // so it can be shared
    let i = 0
    for (let yi = 0; yi < ny; yi++)
      for (let xi = 0; xi < nx; xi++)
        o.g_tiles[i++] = new PIXI.Texture(base,
          new PIXI.Rectangle(xi*tw, yi*th, tw, th))
    // app.stage.addChild(new PIXI.Sprite(o.g_tiles[0]))

    // add g_anim_tiles
    o.g_anim_tiles = []
    for (let ia = 0; ia < o.anims.length; ia++){
      o.g_anim_tiles[ia] = []
      for (let it = 0; it < o.anims[ia].tiles.length; it++){
        let i = o.anims[ia].tiles[it]
        let spr = new PIXI.Sprite(o.g_tiles[i])
        spr.x = it*o.tile_w, spr.y = 0
        this.insert([o.g_anim_tiles[ia], it, spr])
      }
    }

    // let tex = PIXI.Texture.fromBuffer(o.im_data, mw, mh)
    let tex = new PIXI.Texture(base)
    im = new PIXI.Sprite(tex)
    im.scale = {x:s, y:s} // does this need to be a PIXI.ObservablePoint?

    grid = new PIXI.Graphics()
    this.upd_grid()
    sel = new PIXI.Graphics()
    cur = new PIXI.Graphics()
    this.upd_boxes()
    flags = new PIXI.Graphics()
    cur_flag = new PIXI.Graphics()
    for (let i = 0; i < nx*ny; i++)
      flag[i] = new PIXI.Graphics()
    this.upd_flags()
    coll = new PIXI.Graphics()
    i = 0
    for (let yi = 0; yi < ny; yi++)
      for (let xi = 0; xi < nx; xi++)
        for (let ic = 0; ic < ncolls; ic++)
          colls[i++] = new PIXI.Graphics()
    this.upd_colls()

    app.view.addEventListener('mousedown', this.on_click)
    app.view.addEventListener('mousemove', this.on_mousemove)
    app.view.addEventListener('mouseout', this.on_mouseout)
    app.view.addEventListener('mouseenter', this.on_mouseenter)

    app.stage.addChild(im)
    app.stage.addChild(grid)
    app.stage.addChild(cur)
    app.stage.addChild(sel)
    app.stage.addChild(flags)
    app.stage.addChild(cur_flag)
    app.stage.addChild(coll)
  },
}
</script>

<style scoped lang='sass'>
@import ../theme
#toolbar
  display: absolute
  height: 24px
  flex-shrink: 0 // don't collapse empty space when image is big

  .space
    width: 8px
</style>

