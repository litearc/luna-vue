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
import { bus } from './editor_tileset.vue'
let app, spr, grid, cursor, cursor2, nx, ny
let mw, mh, tw, th // image width / height, tile width / height
let icx, icy // cursor x and y positions (column, row)
let iax, iay // auto-tile top-left position (column, row)
let s = 1 // scale factor for image

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
      let ix ,iy
      if (this.tile_sec == 0){
        icx = Math.floor(e.offsetX/(s*tw))
        icy = Math.floor(e.offsetY/(s*th))
        ix = icx
        iy = icy
      } else {
        iax = Math.floor(e.offsetX/(s*tw))-1
        iay = Math.floor(e.offsetY/(s*th))-2
        ix = iax
        iy = iay
      }
      cursor.x = s*tw*ix
      cursor.y = s*th*iy
      if (this.tile_sec == 0)
        this.$emit('tile_changed', icy*nx+icx)
    },
    on_mousemove(e){
      let ix = (this.tile_sec == 0) ? Math.floor(e.offsetX/(s*tw)) : Math.floor(e.offsetX/(s*tw))-1
      let iy = (this.tile_sec == 0) ? Math.floor(e.offsetY/(s*tw)) : Math.floor(e.offsetY/(s*th))-2
      cursor2.x = s*tw*ix
      cursor2.y = s*th*iy
    },
    on_mouseout(){
      cursor2.alpha = 0
    },
    on_mouseenter(){
      cursor2.alpha = .5
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
      let npx = Math.round(s*this.im_width)
      let npy = Math.round(s*this.im_height)
      this.$refs.canvas.width = npx
      this.$refs.canvas.height = npy
      app.view.style.width = `${npx}px`
      app.view.style.height = `${npy}px`
      spr.scale = {x:s, y:s}

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
      if (this.tile_sec == 0){
        ix = icx
        iy = icy
        w = 1
        h = 1
      } else {
        ix = iax
        iy = iay
        w = 3
        h = 4
      }
      cursor.x = s*tw*ix
      cursor.y = s*th*iy
      cursor.clear()
      cursor.lineStyle(4, 0x000000)
      cursor.beginFill(0xffffff, 0)
      cursor.drawRect(0, 0, w*s*tw, h*s*th)
      cursor.lineStyle(2, 0x5c99d6)
      cursor.beginFill(0xffffff, 0)
      cursor.drawRect(0, 0, w*s*tw, h*s*th)
      cursor.endFill()

      cursor2.clear()
      cursor2.lineStyle(4, 0x000000)
      cursor2.beginFill(0xffffff, 0)
      cursor2.drawRect(0, 0, w*s*tw, h*s*th)
      cursor2.lineStyle(2, 0x5c99d6)
      cursor2.beginFill(0xffffff, 0)
      cursor2.drawRect(0, 0, w*s*tw, h*s*th)
      cursor2.endFill()
      cursor2.x = 0
      cursor2.y = 0
      cursor2.alpha = .5
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
    icx = 0
    icy = 0
    iax = 0
    iay = 0

    bus.$on('tile_sec_changed', (i) => {
      cursor.clear()
      this.tile_sec = i
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
    spr = new PIXI.Sprite(tex)
    spr.scale = {x:s, y:s} // does this need to be a PIXI.ObservablePoint?
    app.view.addEventListener('mousedown', this.on_click)
    app.view.addEventListener('mousemove', this.on_mousemove)
    app.view.addEventListener('mouseout', this.on_mouseout)
    app.view.addEventListener('mouseenter', this.on_mouseenter)

    grid = new PIXI.Graphics()
    this.draw_grid()
    cursor = new PIXI.Graphics()
    cursor2 = new PIXI.Graphics()
    this.draw_cursor()
    
    app.stage.addChild(spr)
    app.stage.addChild(grid)
    app.stage.addChild(cursor2)
    app.stage.addChild(cursor)
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

