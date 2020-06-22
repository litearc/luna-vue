// this is the main part of the tileset editor, which shows the tileset image.
// it communicates a lot with the sidebar component `ed_tileset_sidebar`, and
// allows the user to set various tileset/tile properties by clicking on tiles.

<template lang='pug'>
#el_tileset_image.full.flex-col
  // toolbar at the top - contains options to zoom in/out the tileset image,
  // toggle the grid, dim the image, save the tileset, ...
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

  // container and canvas used to render the tileset image
  #image-container.expand.flex.overflow-auto
    canvas#canvas.no-shrink.block.margin-auto(ref='canvas')
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'
import * as PIXI from 'pixi.js'

import { anim_block_type, tile_mode, terra_shape_type } from '../const.js'
import { draw_box, draw_grid } from '../js/image.js'

import { o } from './app.vue'
import { bus } from './editor_tileset.vue'
import { get_json } from './new_tileset.vue'
import { set_g_anim_tiles, set_g_tiles } from './tabs.vue'

let fs = require('fs')
let path = require('path')
let { dialog } = require('electron').remote

// this is used for the collision circles. these are `const` so it's not a
// problem that they aren't component data.
const coll_radius = 1.5
const coll_sq_dim = 2
const coll_coords = []
for (let i = 0; i < 8; i++){
  let a = 45*i*Math.PI/180
  coll_coords[i] = {
    x: .35*Math.cos(a),
    y: .35*Math.sin(a),
  }
}
const i2dir = ['r','dr','d','dl','l','ul','u','ur']
const ncolls = coll_coords.length+1

export default
{
  name: 'ed_tileset_image',

  data(){
    return {
      // pub: process.env.BASE_URL,
      s : 1 // scale (zoom)
    }
  }, // data

  props: {
    o: {},
  }, // props

  computed:{
    ...mapState([
      'itab',
    ]),

    iflag(){ return this.o.iflag },
    iterra(){ return this.o.iterra },
    sec(){ return this.o.sec },

    smw(){ return this.s*this.mw },
    smh(){ return this.s*this.mh },
    stw(){ return this.s*this.tw },
    sth(){ return this.s*this.th },
    scx(){ return this.s*this.icx },
    scy(){ return this.s*this.icy },
    ssx(){ return this.s*this.isx },
    ssy(){ return this.s*this.isy },
    
    terra_1d_pos(){
      if (this.o.iterra === null) return null
      return this.o.terra[this.o.iterra].pos.y * this.nx + this.o.terra[this.o.iterra].pos.x
    },
    
    terra_shape(){
      if (this.o.iterra === null) return null
      return this.o.terra[this.o.iterra].shape
    },
  }, // computed

  watch: {
    // when the currently selected flag changes, update the visibility of all
    // flag markers shown on the tileset image.
    iflag(v){
      let ntiles = this.nx*this.ny
      for (let i = 0; i < ntiles; i++)
        this.flag[i].visible = (v === null) ? false : this.o.flags[v][i]
    },

    // when the position of the currently selected terra changes, move the terra
    // marker (rectangle covering the terra's tiles) to the correct position.
    terra_1d_pos(){
      let vis = (this.o.iterra !== null)
      this.sel.visible = vis
      if (!vis) return
      this.sel.x = this.s*this.tw*this.o.terra[this.o.iterra].pos.x
      this.sel.y = this.s*this.th*this.o.terra[this.o.iterra].pos.y
    },

    // when the shape of the currently selected terra changes, reshape the
    // terra to the new shape.
    terra_shape(){
      let w, h
      if (this.terra_shape === terra_shape_type._4x3)
        w = 3, h = 4
      else if (this.terra_shape === terra_shape_type._5x1)
        w = 1, h = 5
      this.sel.clear()
      this.cur.clear()
      draw_box(this.sel, w*this.s*this.tw, h*this.s*this.th)
      draw_box(this.cur, w*this.s*this.tw, h*this.s*this.th)
    },

    // when the current tileset section changes, update the necessary graphics.
    sec(i, iprev){
      if ( i === tile_mode.props
       || (i === tile_mode.terra && this.o.iterra !== null)
       ||  i === tile_mode.coll
      )
        this.sel.visible = true
      if (i === tile_mode.anim)
        this.sel.visible = false
      this.upd_boxes()
      if (i === tile_mode.flags || iprev === tile_mode.flags)
        this.upd_flags()
      if (i === tile_mode.coll || iprev === tile_mode.coll)
        this.upd_colls()
    },
  }, // watch

  methods: {
    ...mapMutations([
      'insert',
      'flip',
      'push',
      'set_prop',
    ]),

    // handle the click events for the different tileset sections.
    on_click(e){
      switch (this.o.sec){
        // flags: toggle the flag for the current tile the mouse is over.
        case tile_mode.flags:
          if (this.o.iflag === null) return
          let i = this.iy*this.nx+this.ix
          this.flip([this.o.flags[this.o.iflag], i])
          this.flag[i].visible = this.o.flags[this.o.iflag][i]
          return

        // props: move the selection to the current tile, and
        // set the current tile to the one the mouse is over.
        case tile_mode.props:
          this.isx = this.ix
          this.isy = this.iy
          this.sel.x = this.isx*this.s*this.tw
          this.sel.y = this.isy*this.s*this.th
          this.set_prop([this.o, 'itile', this.isy*this.nx+this.isx])
          break

        // terra: move the selection and cursor to the current tile, and
        // set the position of the current terra to the current tile.
        case tile_mode.terra:
          if (this.o.iterra === null) return
          if (this.terra_shape === terra_shape_type._4x3)
            this.icx = this.ix-1,
            this.icy = this.iy-2
          else if (this.terra_shape === terra_shape_type._5x1)
            this.icx = this.ix,
            this.icy = this.iy-2
          this.sel.x = this.icx*this.s*this.tw
          this.sel.y = this.icy*this.s*this.th
          this.set_prop([this.o.terra[this.o.iterra].pos, 'x', this.icx])
          this.set_prop([this.o.terra[this.o.iterra].pos, 'y', this.icy])
          break

        // anim: if the currently selected anim is of type "tile", add the
        // current tile to the anim.
        case tile_mode.anim:
          if (this.o.ianim !== null){
            let block_type = this.o.anims[this.o.ianim].block_type
            if (block_type !== anim_block_type.not_set && block_type !== anim_block_type.tile)
              return
            this.set_prop([this.o.anims[this.o.ianim], 'block_type', anim_block_type.tile])
            let i = this.iy*this.nx+this.ix
            this.insert([this.o.anims[this.o.ianim].tiles, this.o.anim_pos, i])
            bus.$emit('add_tile_anim', i)
          }
          break

        // coll: if clicked on one of the circles, toggle the circle.
        // if clicked on the square, if any circle is on, turn all circles off,
        // otherwise turn all circles on.
        case tile_mode.coll:
          // clicked on the square
          if (this.curr_coll%ncolls === ncolls-1){
            // if any circle is on, turn all off
            let any_on = false
            for (let ic = 0; ic < ncolls-1; ic++){
              if (this.o.colls[this.coll_tile][i2dir[ic]] === true){
                any_on = true
                break
              }
            }
            let state = !any_on // set all circles to this state
            let ii = Math.floor(this.curr_coll/ncolls)*ncolls
            for (let ic = 0; ic < ncolls-1; ic++){
              let dir = i2dir[ic]
              this.set_prop([this.o.colls[this.coll_tile], dir, state])
              this.colls[ii+ic].alpha = (this.o.colls[this.coll_tile][dir]) ? 1 : .5
            }
          }
          // toggle circle
          else if (this.curr_coll !== null){
            let dir = i2dir[this.curr_coll%ncolls]
            this.flip([this.o.colls[this.coll_tile], dir])
            this.colls[this.curr_coll].alpha = (this.o.colls[this.coll_tile][dir]) ? 1 : .5
          }
          break
      }
    }, // on_click

    on_mousemove(e){
      this.ix = Math.max(Math.min(Math.floor(e.offsetX/(this.s*this.tw)), this.nx-1), 0)
      this.iy = Math.max(Math.min(Math.floor(e.offsetY/(this.s*this.th)), this.ny-1), 0)

      switch (this.sec){
        // flags: move current flag cursor to the current tile.
        case tile_mode.flags:
          this.cur_flag.x = this.s*this.ix*this.tw
          this.cur_flag.y = this.s*this.iy*this.th
          break

        // props, anim: move cursor to the current tile.
        case tile_mode.props:
        case tile_mode.anim:
          this.cur.x = this.s*this.tw*this.ix
          this.cur.y = this.s*this.th*this.iy
          break

        // terra: move cursor to the proper tile. the cursor is centered around
        // the mouse position, so we account for the size/shape of the cursor.
        case tile_mode.terra:
          if (this.terra_shape === terra_shape_type._4x3)
            this.cur.x = this.s*this.tw*(this.ix-1),
            this.cur.y = this.s*this.th*(this.iy-2)
          else if (this.terra_shape === terra_shape_type._5x1)
            this.cur.x = this.s*this.tw*this.ix,
            this.cur.y = this.s*this.th*(this.iy-2)
          break

        case tile_mode.coll:
          // reset previous tile coll circles
          if (this.coll_tile !== null){
            let ii = this.coll_tile*ncolls 
            for (let ic = 0; ic < ncolls; ic++)
              this.colls[ii+ic].tint = 0x5c99d6
          }
          // check if we are hovering over any coll graphic.
          // first, get normalized (x, y) position (b/w -.5 and +.5) within current tile.
          let xp = e.offsetX%(this.s*this.tw)/(this.s*this.tw)-.5 
            , yp = e.offsetY%(this.s*this.th)/(this.s*this.th)-.5
          this.coll_tile = this.iy*this.nx+this.ix
          let ii = this.coll_tile*ncolls 
          let cr2 = Math.pow(coll_radius/this.tw,2)
          this.curr_coll = null
          // check if mouse is over any of the circles.
          for (let ic = 0; ic < ncolls-1; ic++)
            if ((Math.pow(xp-coll_coords[ic].x,2) + Math.pow(yp-coll_coords[ic].y,2)) <= cr2){
              this.colls[ii+ic].tint = 0xd6b85c
              this.curr_coll = ii+ic
              break
            }
          // check if mouse is over center square.
          if (Math.abs(xp) <= coll_sq_dim/this.tw/2 && Math.abs(yp) <= coll_sq_dim/this.th/2){
            this.colls[ii+ncolls-1].tint = 0xd6b85c
            this.curr_coll = ii+ncolls-1
          }
          break
      }
    }, // on_mousemove

    // make cursor disappear when mouse exits canvas...
    on_mouseout(){
      if (this.o.sec == tile_mode.flags)
        this.cur_flag.visible = false
      if ( this.o.sec == tile_mode.props
        || this.o.sec == tile_mode.terra
        || this.o.sec == tile_mode.anim
      ) this.cur.visible = false
    },
    // ...and reappear when mouse enters canvas.
    on_mouseenter(){
      if (this.o.sec == tile_mode.flags && this.o.iflag !== null)
        this.cur_flag.visible = true
      if ( this.o.sec == tile_mode.props
        || (this.o.sec == tile_mode.terra && this.o.iterra !== null)
        || (this.o.sec == tile_mode.anim && this.o.ianim !== null && this.o.anims[this.o.ianim].block_type !== anim_block_type.terra)
      ) this.cur.visible = true
    },

    // show save dialog.
    on_save(){
      if (this.o.file === null){
        dialog.showSaveDialog({
          defaultPath: path.dirname(this.o.fpath),
        }).then(({canceled, filePath}) => {
          if (!canceled){
            console.log('writing json file')
            try {
              fs.writeFileSync(filePath, get_json(this.o))
              this.$message({message: 'Saved tileset file', type: 'success'})
            }
            catch(err) {
              this.$message({message: 'Error tileset file', type: 'failure'})
            }
          }
        })
      }
    },

    // zoom out tileset image.
    on_zoom_out(){
      if (this.s <= .25) return // min zoom is 1/4.
      this.s /= 2
      if (this.s >= 1)
        this.s = Math.round(this.s)
      this.o.zoom = this.s
      this.resize_image()
    },

    // zoom in tileset image.
    on_zoom_in(){
      if (this.s >= 4) return // max zoom is 4.
      this.s *= 2
      if (this.s >= 1)
        this.s = Math.round(this.s)
      this.o.zoom = this.s
      this.resize_image()
    },

    // resize tileset image (used by zoom in/out functions).
    resize_image(){
      let id = this.$refs.canvas
      let npx = Math.round(this.s*this.mw)
      let npy = Math.round(this.s*this.mh)
      id.width = npx
      id.height = npy
      id.style.width = `${npx}px`
      id.style.height = `${npy}px`
      this.im.scale = {x:this.s, y:this.s}
      this.upd_all()
    },

    // toggle dim on tileset image.
    toggle_dim(){
      this.im.tint = (this.im.tint === 0xffffff) ? 0x888888 : 0xffffff
      this.o.dim = (this.im.tint !== 0xffffff)
    },

    // toggle grid over tileset image.
    toggle_grid(){
      this.grid.visible = !this.grid.visible
      this.o.grid = this.grid.visible
    },

    // draw grid over tileset image.
    upd_grid(){
      draw_grid(this.grid, this.s*this.mw, this.s*this.mh, this.s*this.tw, this.s*this.th)
    },

    // update/draw all graphics.
    upd_all(){
      // in the update functions, we redraw the graphics instead of simply
      // scaling them because we want to make the graphics "fill" section larger
      // but keep the borders the same width
      this.upd_grid()
      this.upd_boxes()
      this.upd_flags()
      this.upd_colls()
    },

    // update the selection and cursor boxes - these depend on which tileset
    // mode is currently active.
    upd_boxes(){
      this.sel.clear()
      this.cur.clear()
      if (this.o.sec == tile_mode.flags)
        return
      let w, h
      if (this.o.sec == tile_mode.props){
        this.sel.x = this.s*this.tw*this.isx
        this.sel.y = this.s*this.th*this.isy
        w = 1, h = 1
      }
      if (this.o.sec == tile_mode.anim){
        this.sel.x = this.s*this.tw*this.isx
        this.sel.y = this.s*this.th*this.isy
        w = 1, h = 1
        if (this.o.ianim === null)
          this.sel.visible = false, this.cur.visible = false
      }
      if (this.o.sec == tile_mode.terra){
        this.sel.x = this.s*this.tw*this.icx
        this.sel.y = this.s*this.th*this.icy
        if (this.terra_shape === terra_shape_type._4x3)
          w = 3, h = 4
        else if (this.terra_shape === terra_shape_type._5x1)
          w = 1, h = 5
        if (this.o.iterra === null)
          this.sel.visible = false,
          this.cur.visible = false
      }
      draw_box(this.sel, w*this.s*this.tw, h*this.s*this.th)
      draw_box(this.cur, w*this.s*this.tw, h*this.s*this.th)
      this.cur.alpha = .5
    },

    // draw collision circles/square - unlink some of the other graphics, which
    // have both a fill and an edge, these only have a fill, so we can scale
    // simply scale them and they will still look correct (which is good because
    // redrawing all these is slow).
    upd_colls(){
      this.coll.visible = (this.o.sec === tile_mode.coll)
      if (this.colls_init === false){
        this.colls_init = true
        this.coll.clear()
        let i = 0
        for (let yi = 0; yi < this.ny; yi++){
          for (let xi = 0; xi < this.nx; xi++){
            let x = this.s*(xi+.5)*this.tw, y = this.s*(yi+.5)*this.th
            // draw circles for collisions for different directions
            for (let ic = 0; ic < ncolls-1; ic++){
              this.colls[i].clear()
              this.colls[i].beginFill(0xffffff, 1)
              this.colls[i].drawCircle(x+this.tw*this.s*coll_coords[ic].x,
                y+this.th*this.s*coll_coords[ic].y, this.s*coll_radius)
              this.colls[i].alpha = (this.o.colls[yi*this.nx+xi][i2dir[ic]]) ? 1.0 : .5
              this.colls[i].tint = 0x5c99d6
              this.coll.addChild(this.colls[i])
              i++
            }
            // draw the center square
            this.colls[i].clear()
            this.colls[i].beginFill(0xffffff, 1)
            this.colls[i].drawRect(x-this.s*coll_sq_dim/2, y-this.s*coll_sq_dim/2,
              this.s*coll_sq_dim, this.s*coll_sq_dim)
            this.colls[i].alpha = .5
            this.colls[i].tint = 0x5c99d6
            this.coll.addChild(this.colls[i])
            i++
          }
        }
      }
      else
        this.coll.scale = {x:this.s, y:this.s}
    },

    // draw all flag indicators.
    upd_flags(){
      this.flags.visible = (this.o.sec === tile_mode.flags)
      this.cur_flag.clear()
      this.cur_flag.lineStyle(1, 0x000000)
      this.cur_flag.beginFill(0x5c99d6, 1)
      this.cur_flag.drawCircle(this.s*.5*this.tw, this.s*.5*this.th, this.s*4)
      this.cur_flag.alpha = .5
      this.cur_flag.visible = false
      for (let ix = 0; ix < this.nx; ix++){
        for (let iy = 0; iy < this.ny; iy++){
          let i = iy*this.nx+ix
          this.flag[i].clear()
          this.flag[i].lineStyle(1, 0x000000)
          this.flag[i].beginFill(0x5c99d6, 1)
          this.flag[i].drawCircle(this.s*(ix+.5)*this.tw, this.s*(iy+.5)*this.th, this.s*4)
          this.flag[i].visible = (this.o.iflag === null) ? false : this.o.flags[this.o.iflag][i]
          this.flags.addChild(this.flag[i])
        }
      }
    },
  }, // methods

  created(){
    this.mw         = this.o.im_w
    this.mh         = this.o.im_h
    this.tw         = this.o.tile_w
    this.th         = this.o.tile_h
    this.nx         = Math.round(this.mw/this.tw)
    this.ny         = Math.round(this.mh/this.th)
    this.isx        = 0
    this.isy        = 0
    this.icx        = 0
    this.icy        = 0
    this.app        = null
    this.im         = null
    this.app        = null
    this.im         = null
    this.grid       = null
    this.sel        = null
    this.cur        = null
    this.flags      = null
    this.cur_flag   = null
    this.coll       = null
    this.colls      = []
    this.flag       = []
    this.ix         = null
    this.iy         = null
    this.colls_init = false
    this.coll_tile  = null
    this.curr_coll  = null

    // load image data and parse tiles.
    let base = PIXI.BaseTexture.fromBuffer(this.o.im_data, this.mw, this.mh)
    set_g_tiles(this.itab, base, this.nx, this.ny, this.tw, this.th)
    set_g_anim_tiles(this.itab, this.o.anims, this.tw)

    // let tex = PIXI.Texture.fromBuffer(this.o.im_data, this.mw, mh)
    let tex = new PIXI.Texture(base)
    this.im = new PIXI.Sprite(tex)
    this.im.scale = {x:this.s, y:this.s}

    this.grid = new PIXI.Graphics()
    this.upd_grid()
    this.sel = new PIXI.Graphics()
    this.cur = new PIXI.Graphics()
    this.upd_boxes()
    this.flags = new PIXI.Graphics()
    this.cur_flag = new PIXI.Graphics()
    for (let i = 0; i < this.nx*this.ny; i++)
      this.flag[i] = new PIXI.Graphics()
    this.upd_flags()
    this.coll = new PIXI.Graphics()
    let i = 0
    for (let yi = 0; yi < this.ny; yi++)
      for (let xi = 0; xi < this.nx; xi++)
        for (let ic = 0; ic < ncolls; ic++)
          this.colls[i++] = new PIXI.Graphics()
    this.upd_colls()
  }, // created

  mounted(){
    // let tex = PIXI.Texture.from(`${this.pub}hummingbird.png`)
    
    this.$refs.canvas.style.width = `${Math.round(this.s*this.mw)}px`
    this.$refs.canvas.style.height = `${Math.round(this.s*this.mh)}px`

    this.app = new PIXI.Application({
      width: this.s*this.mw,
      height: this.s*this.mh,
      view: this.$refs.canvas,
      resizeTo: this.$refs.canvas,
      antialias: true,
    })

    this.app.stage.addChild(this.im)
    this.app.stage.addChild(this.grid)
    this.app.stage.addChild(this.cur)
    this.app.stage.addChild(this.sel)
    this.app.stage.addChild(this.flags)
    this.app.stage.addChild(this.cur_flag)
    this.app.stage.addChild(this.coll)
  }, // mounted

  activated(){
    this.app.view.addEventListener('mousedown', this.on_click)
    this.app.view.addEventListener('mousemove', this.on_mousemove)
    this.app.view.addEventListener('mouseout', this.on_mouseout)
    this.app.view.addEventListener('mouseenter', this.on_mouseenter)
  }, // activated

  deactivated(){
    this.app.view.removeEventListener('mousedown', this.on_click)
    this.app.view.removeEventListener('mousemove', this.on_mousemove)
    this.app.view.removeEventListener('mouseout', this.on_mouseout)
    this.app.view.removeEventListener('mouseenter', this.on_mouseenter)
  }, // deactivated
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

