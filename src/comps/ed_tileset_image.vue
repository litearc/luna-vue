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
    ui-tooltip(text='Grid')
      ui-icon.toolbar-icon(icon='grid' height='12px' text base)
    .space
    ui-tooltip(text='Save')
      faicon.icon.toolbar-icon(icon='save')
  #image-container.expand.flex.overflow-auto
    canvas#canvas.no-shrink.block.margin-auto(ref='canvas')
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'
import * as PIXI from 'pixi.js'
import { anim_block_type, tile_mode, terra_shape_type } from '../const.js'
import { bus } from './editor_tileset.vue'

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
let a = .15, w = .175 // need: a+w > .5-w
let coll_coords = [
  [ {x:.5, y:a},    {x:.5+w, y:a+w},   {x:.5-w, y:a+w}   ],
  [ {x:1-a, y:a},   {x:1-a, y:a+w},    {x:1-a-w, y:a}    ],
  [ {x:1-a, y:.5},  {x:1-a-w, y:.5+w}, {x:1-a-w, y:.5-w} ],
  [ {x:1-a, y:1-a}, {x:1-a-w, y:1-a},  {x:1-a, y:1-a-w}  ],
  [ {x:.5, y:1-a},  {x:.5-w, y:1-a-w}, {x:.5+w, y:1-a-w} ],
  [ {x:a, y:1-a},   {x:a, y:1-a-w},    {x:a+w, y:1-a}    ],
  [ {x:a, y:.5},    {x:a+w, y:.5-w},   {x:a+w, y:.5+w}   ],
  [ {x:a, y:a},     {x:a+w, y:a},      {x:a, y:a+w}      ],
]
let colls_init = false

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
    sec(i){
      if (i === tile_mode.props
       || (i === tile_mode.terra && o.iterra !== null))
        sel.visible = true
      if (i === tile_mode.anim)
        sel.visible = false
      this.upd_all()
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
      }
    },

    on_mousemove(e){
      ix = Math.floor(e.offsetX/(s*tw))
      iy = Math.floor(e.offsetY/(s*tw)) 
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

    on_zoom_out(){
      if (s <= .25) return // min zoom
      s /= 2
      if (s >= 1)
        s = Math.round(s)
      this.resize_image()
    },
    on_zoom_in(){
      if (s >= 4) return // max zoom
      s *= 2
      if (s >= 1)
        s = Math.round(s)
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

    upd_grid(){
      grid.clear()
      grid.position.set(0, 0)
      grid.lineStyle(1, 0xffffff)
      for (let i = 1; i < nx; i++)
        grid.moveTo(s*tw*i, 0).lineTo(s*tw*i, s*mh+1)
      for (let i = 1; i < ny; i++)
        grid.moveTo(0, s*th*i).lineTo(s*mw+1, s*th*i)
      grid.alpha = .1
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
      if (colls_init === false){
        coll.clear()
        let i = 0
        for (let yi = 0; yi < ny; yi++)
          for (let xi = 0; xi < nx; xi++)
            for (let ic = 0; ic < coll_coords.length; ic++){
              let x = s*xi*tw, y = s*yi*th
              colls[i].clear()
              colls[i].beginFill(0x5c99d6, 1)
              colls[i].moveTo(x+tw*s*coll_coords[ic][0].x, y+th*s*coll_coords[ic][0].y)
              colls[i].lineTo(x+tw*s*coll_coords[ic][1].x, y+th*s*coll_coords[ic][1].y)
              colls[i].lineTo(x+tw*s*coll_coords[ic][2].x, y+th*s*coll_coords[ic][2].y)
              colls[i].closePath()
              colls[i].endFill()
              coll.addChild(colls[i])
              i++
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

    // let tex = PIXI.Texture.fromBuffer(o.im_data, mw, mh)
    let tex = new PIXI.Texture(base)
    im = new PIXI.Sprite(tex)
    im.scale = {x:s, y:s} // does this need to be a PIXI.ObservablePoint?
    app.view.addEventListener('mousedown', this.on_click)
    app.view.addEventListener('mousemove', this.on_mousemove)
    app.view.addEventListener('mouseout', this.on_mouseout)
    app.view.addEventListener('mouseenter', this.on_mouseenter)

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
        for (let ic = 0; ic < coll_coords.length; ic++)
          colls[i++] = new PIXI.Graphics()
    this.upd_colls()
    coll.visible = false

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

