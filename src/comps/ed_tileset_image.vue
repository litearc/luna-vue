<template lang='pug'>
#el_tileset_image.full.flex-col
  #toolbar.center
    ui-tooltip(text='Zoom Out')
      faicon.toolbar-icon(
        icon='search-minus'
        @mousedown='on_zoom_out'
      )
    .space
    ui-tooltip(text='Zoom In')
      faicon.toolbar-icon(
        icon='search-plus'
        @mousedown='on_zoom_in'
      )
    .space
    ui-tooltip(text='Grid')
      ui-icon.toolbar-icon(icon='grid' height='12px' text base)
    .space
    ui-tooltip(text='Save')
      faicon.toolbar-icon(icon='save')
  #image-container.expand.flex.overflow-auto
    canvas#canvas.no-shrink.block.margin-auto(ref='canvas')
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'
import * as PIXI from 'pixi.js'
import { tile_mode } from '../const.js'
import { bus } from './editor_tileset.vue'

let app, im, grid, sel, cur
let nx, ny         // number of tiles along x, y
let mw, mh, tw, th // image width / height, tile width / height
let isx, isy       // sel x and y positions (column, row)
let icx, icy       // auto-tile top-left position (column, row)
let s = 1          // scale factor for image

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
      tile_sec: 0,
    }
  },

  computed: {
    ...mapState([
      'tabs',
    ])
  },

  props: {
    itab: {},
  },

  methods: {
    on_click(e){
      let ix = Math.floor(e.offsetX/(s*tw))
        , iy = Math.floor(e.offsetY/(s*th))
      if (this.tile_sec == tile_mode.props){
        isx = ix, isy = iy
        this.$emit('tile_changed', isy*nx+isx)
      }
      if (this.tile_sec == tile_mode.terra){
        ix -= 1, iy -= 2
        icx = ix, icy = iy
      }
      sel.x = ix*s*tw
      sel.y = iy*s*th
    },

    on_mousemove(e){
      let ix = Math.floor(e.offsetX/(s*tw))
        , iy = Math.floor(e.offsetY/(s*tw)) 
      if (this.tile_sec == tile_mode.terra)
        ix -= 1, iy -= 2 
      cur.x = s*tw*ix
      cur.y = s*th*iy
    },

    // make cursor disappear when mouse exits canvas
    on_mouseout(){
      cur.alpha = 0
    },
    on_mouseenter(){
      cur.alpha = .5
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
      this.draw_grid()
      this.draw_cursor()
    },

    draw_grid(){
      grid.clear()
      grid.position.set(0, 0)
      grid.lineStyle(1, 0xffffff)
      for (let ix = 1; ix < nx; ix++)
        grid.moveTo(s*tw*ix, 0).lineTo(s*tw*ix, s*mh+1)
      for (let iy = 1; iy < ny; iy++)
        grid.moveTo(0, s*th*iy).lineTo(s*mw+1, s*th*iy)
      grid.alpha = .1
    },

    draw_cursor(){
      let ix, iy, w, h
      if (this.tile_sec == tile_mode.props){
        ix = isx, iy = isy
        w = 1, h = 1
      }
      if (this.tile_sec == tile_mode.terra){
        ix = icx, iy = icy
        w = 3, h = 4
      }
      sel.x = s*tw*ix
      sel.y = s*th*iy
      draw_box(sel, w*s*tw, h*s*th)
      draw_box(cur, w*s*tw, h*s*th)
      cur.alpha = .5
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

    bus.$on('tile_sec_changed', (i) => {
      this.tile_sec = i
      console.log('tile sec changed to ' + i)
      this.draw_cursor()
    })
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
    })
    let tex = PIXI.Texture.fromBuffer(im_data, mw, mh)
    im = new PIXI.Sprite(tex)
    im.scale = {x:s, y:s} // does this need to be a PIXI.ObservablePoint?
    app.view.addEventListener('mousedown', this.on_click)
    app.view.addEventListener('mousemove', this.on_mousemove)
    app.view.addEventListener('mouseout', this.on_mouseout)
    app.view.addEventListener('mouseenter', this.on_mouseenter)

    grid = new PIXI.Graphics()
    this.draw_grid()
    sel = new PIXI.Graphics()
    cur = new PIXI.Graphics()
    this.draw_cursor()
    
    app.stage.addChild(im)
    app.stage.addChild(grid)
    app.stage.addChild(cur)
    app.stage.addChild(sel)
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

