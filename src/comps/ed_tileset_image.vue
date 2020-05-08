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
  #image-container.expand.flex.overflow-auto.border-red
    canvas#canvas.fixed.block.margin-auto.border-green(ref='canvas')
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'
import * as PIXI from 'pixi.js'
let app, spr, grid, cursor
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
      cursor.x = this.tile_width*Math.floor(e.offsetX/(s*this.tile_width))
      cursor.y = this.tile_height*Math.floor(e.offsetY/(s*this.tile_height))
    },
    on_zoom_out(){
      s /= 1.5
      this.resize_image()
    },
    on_zoom_in(){
      s *= 1.5
      this.resize_image()
    },
    resize_image(){
      this.$refs.canvas.style.width = `${Math.round(s*this.im_width)}px`
      this.$refs.canvas.style.height = `${Math.round(s*this.im_height)}px`

      // spr.scale = {x:s, y:s}
      // grid.scale = {x:s, y:s}
      // app.view.style.width = `${Math.round(s*this.im_width)}px`
      // app.view.style.height = `${Math.round(s*this.im_height)}px`
      // console.log(`image size: ${app.view.style.width}, ${app.view.style.height}`)
    }
  },

  created(){
    let data = this.tabs[this.itab].data
    this.tile_width = data.tile_width
    this.tile_height = data.tile_height
    this.im_width = data.im_width
    this.im_height = data.im_height
  },

  mounted(){
    // let tex = PIXI.Texture.from(`${this.pub}hummingbird.png`)
    
    // tileset image
    let {
      im_data,
      im_width,
      im_height,
      tile_width,
      tile_height
    } = this.tabs[this.itab].data

    let nx = Math.round(im_width/tile_width)
    let ny = Math.round(im_height/tile_height)

    this.$refs.canvas.style.width = `${Math.round(s*this.im_width)}px`
    this.$refs.canvas.style.height = `${Math.round(s*this.im_height)}px`

    app = new PIXI.Application({
      width: s*im_width,
      height: s*im_height,
      view: this.$refs.canvas
    })
    // this.$refs.root.appendChild(app.view)
    let tex = PIXI.Texture.fromBuffer(im_data, im_width, im_height)
    spr = new PIXI.Sprite(tex)
    spr.scale = {x:s, y:s} // does this need to be a PIXI.ObservablePoint?
    app.view.addEventListener('mousedown', this.on_click)

    // tile grid
    grid = new PIXI.Graphics()
    grid.position.set(0, 0)
    grid.lineStyle(1, 0xffffff)
    for (let ix = 1; ix < nx; ix++)
      grid.moveTo(s*tile_width*ix, 0).lineTo(s*tile_width*ix, s*im_height+1)
    for (let iy = 1; iy < ny; iy++)
      grid.moveTo(0, s*tile_height*iy).lineTo(s*im_width+1, s*tile_height*iy)
    grid.alpha = .1

    cursor = new PIXI.Graphics()
    cursor.lineStyle(4, 0x000000)
    cursor.beginFill(0xffffff, 0)
    cursor.drawRect(0, 0, s*tile_width, s*tile_height)
    cursor.lineStyle(2, 0x5c99d6)
    cursor.beginFill(0xffffff, 0)
    cursor.drawRect(0, 0, s*tile_width, s*tile_height)
    cursor.endFill()
    
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

