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
import { tile_mode } from '../const.js'
import { bus } from './editor_tileset.vue'

let app, im, grid, sel, cur, flags, cur_flag, tiles // pixi graphics
let flag = []      // array of flags
let ix, iy         // current tile mouse is over
let nx, ny         // number of tiles along x, y
let mw, mh, tw, th // image width / height, tile width / height
let isx, isy       // sel x and y positions (column, row)
let icx, icy       // auto-tile top-left position (column, row)
let s = 1          // scale factor for image
let tile_flags, tile_terra

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

  data(){
    return {
      pub: process.env.BASE_URL,
      im_width: null,
      im_height: null,
      tile_width: 1,
      tile_height: 1,
    }
  },

  computed: {
    ...mapState([
      'tabs',
    ])
  },

  props: {
    iflag: {},
    itab: {},
    iterra: {},
    tile_sec: {},
  },

  watch: {
    iflag(v){
      // update flags for all tiles
      let ntiles = nx*ny
      for (let i = 0; i < ntiles; i++)
        flag[i].visible = (v === null) ? false : tile_flags[v][i]
    },
    iterra(v){
      let vis = (v !== null)
      sel.visible = vis
      if (!vis) return
      sel.x = tile_terra[v].pos.x
      sel.y = tile_terra[v].pos.y
    },
    tile_sec(i){
      if (i === tile_mode.props)
        sel.visible = true
      this.upd_all()
    }
  },

  methods: {
    ...mapMutations([
      'flip',
      'set_prop',
    ]),

    on_click(e){
      switch (this.tile_sec){
        case tile_mode.flags:
          if (this.iflag === null) return
          let i = iy*nx+ix
          this.flip([tile_flags[this.iflag], i])
          flag[i].visible = tile_flags[this.iflag][i]
          return
        case tile_mode.props:
          isx = ix, isy = iy
          sel.x = isx*s*tw, sel.y = isy*s*th
          this.$emit('set_itile', isy*nx+isx)
          break
        case tile_mode.terra:
          if (this.iterra === null) return
          icx = ix-1, icy = iy-2
          sel.x = icx*s*tw, sel.y = icy*s*th
          this.set_prop([tile_terra[this.iterra].pos, 'x', sel.x])
          this.set_prop([tile_terra[this.iterra].pos, 'y', sel.y])
          break
      }
    },

    on_mousemove(e){
      ix = Math.floor(e.offsetX/(s*tw))
      iy = Math.floor(e.offsetY/(s*tw)) 
      switch (this.tile_sec){
        case tile_mode.flags:
          cur_flag.x = s*ix*tw
          cur_flag.y = s*iy*th
          break
        case tile_mode.props:
          cur.x = s*tw*ix
          cur.y = s*th*iy
          break
        case tile_mode.terra:
          cur.x = s*tw*(ix-1)
          cur.y = s*th*(iy-2)
          break
      }
    },

    // make cursor disappear when mouse exits canvas
    on_mouseout(){
      if (this.tile_sec == tile_mode.flags)
        cur_flag.visible = false
      if (this.tile_sec == tile_mode.props || this.tile_sec == tile_mode.terra)
        cur.visible = false
    },
    on_mouseenter(){
      if (this.tile_sec == tile_mode.flags && this.iflag !== null)
        cur_flag.visible = true
      if (this.tile_sec == tile_mode.props ||
        (this.tile_sec == tile_mode.terra && this.iterra !== null))
        cur.visible = true
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
      this.upd_grid()
      this.upd_boxes()
      this.upd_flags()
    },

    upd_boxes(){
      sel.clear()
      cur.clear()
      if (this.tile_sec == tile_mode.flags)
        return
      let w, h
      if (this.tile_sec == tile_mode.props){
        sel.x = s*tw*isx, sel.y = s*th*isy
        w = 1, h = 1
      }
      if (this.tile_sec == tile_mode.terra){
        sel.x = s*tw*icx, sel.y = s*th*icy
        w = 3, h = 4
        if (this.iterra === null)
          sel.visible = false, cur.visible = false
      }
      draw_box(sel, w*s*tw, h*s*th)
      draw_box(cur, w*s*tw, h*s*th)
      cur.alpha = .5
    },

    upd_flags(){
      flags.visible = (this.tile_sec === tile_mode.flags)
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
          if (this.iflag === null ||
              tile_flags[this.iflag][i] === false)
            flag[i].visible = false
          flags.addChild(flag[i])
        }
      }
    },
  },

  created(){
    let data = this.tabs[this.itab].data
    this.tile_width = data.tile_width
    this.tile_height = data.tile_height
    this.im_width = data.im_width
    this.im_height = data.im_height

    mw = this.im_width
    mh = this.im_height
    tw = this.tile_width
    th = this.tile_height
    nx = Math.round(mw/tw)
    ny = Math.round(mh/th)
    isx = 0
    isy = 0
    icx = 0
    icy = 0

    tile_flags = this.tabs[this.itab].data.tile_flags
    tile_terra = this.tabs[this.itab].data.tile_terra
    this.$emit('set_ntiles', nx*ny)
  },

  mounted(){
    // let tex = PIXI.Texture.from(`${this.pub}hummingbird.png`)
    
    let { im_data } = this.tabs[this.itab].data
    this.$refs.canvas.style.width = `${Math.round(s*mw)}px`
    this.$refs.canvas.style.height = `${Math.round(s*mh)}px`

    app = new PIXI.Application({
      width: s*mw,
      height: s*mh,
      view: this.$refs.canvas,
      antialias: true,
    })

    let base = PIXI.BaseTexture.fromBuffer(im_data, mw, mh)

    // extract tiles
    tiles = []
    let i = 0
    for (let xi = 0; xi < nx; xi++)
      for (let yi = 0; yi < ny; yi++)
        tiles[i++] = new PIXI.Sprite(new PIXI.Texture(base,
          new PIXI.Rectangle(xi*tw, yi*th, tw, th)))

    // let tex = PIXI.Texture.fromBuffer(im_data, mw, mh)
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

    app.stage.addChild(im)
    app.stage.addChild(grid)
    app.stage.addChild(cur)
    app.stage.addChild(sel)
    app.stage.addChild(flags)
    app.stage.addChild(cur_flag)
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

