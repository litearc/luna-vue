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
let app, spr, grid, cursor, nx, ny
let mw, mh, tw, th // image width / height, tile width / height
let icx, icy // cursor x and y positions (column, row)
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
      nxtiles: null,
      nytiles: null,
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
      icx = Math.floor(e.offsetX/(s*tw))
      icy = Math.floor(e.offsetY/(s*th))
      cursor.x = s*tw*icx
      cursor.y = s*th*icy
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
      nx = Math.round(s*this.im_width)
      ny = Math.round(s*this.im_height)
      this.$refs.canvas.width = nx
      this.$refs.canvas.height = ny
      app.view.style.width = `${nx}px`
      app.view.style.height = `${ny}px`
      spr.scale = {x:s, y:s}

      grid.clear()
      this.draw_grid()
      cursor.clear()
      this.draw_cursor()
    },
    draw_grid(){
      grid.position.set(0, 0)
      grid.lineStyle(1, 0xffffff)
      for (let ix = 1; ix < nx; ix++)
        grid.moveTo(s*tw*ix, 0).lineTo(s*tw*ix, s*mh+1)
      for (let iy = 1; iy < ny; iy++)
        grid.moveTo(0, s*th*iy).lineTo(s*mw+1, s*th*iy)
      grid.alpha = .1
    },
    draw_cursor(){
      cursor.x = s*tw*icx
      cursor.y = s*th*icy
      cursor.lineStyle(4, 0x000000)
      cursor.beginFill(0xffffff, 0)
      cursor.drawRect(0, 0, s*tw, s*th)
      cursor.lineStyle(2, 0x5c99d6)
      cursor.beginFill(0xffffff, 0)
      cursor.drawRect(0, 0, s*tw, s*th)
      cursor.endFill()
    }
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

    grid = new PIXI.Graphics()
    this.draw_grid()
    cursor = new PIXI.Graphics()
    this.draw_cursor()
    
    app.stage.addChild(spr)
    app.stage.addChild(grid)
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

