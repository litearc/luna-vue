<template lang='pug'>
#el_tileset_image.full
  #toolbar.center
    ui-tooltip(text='Zoom Out')
      faicon.toolbar-icon(icon='search-minus')
    .space
    ui-tooltip(text='Zoom In')
      faicon.toolbar-icon(icon='search-plus')
    .space
    ui-tooltip(text='Grid')
      ui-icon.toolbar-icon(icon='grid' height='12px' text base)
    .space
    ui-tooltip(text='Save')
      faicon.toolbar-icon(icon='save')
  #image.center(ref='root')
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'
import * as PIXI from 'pixi.js'
let app, grid

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
    draw_grid(){
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

    app = new PIXI.Application({width: im_width, height: im_height})
    this.$refs.root.appendChild(app.view)
    let tex = PIXI.Texture.fromBuffer(im_data, im_width, im_height)
    let spr = new PIXI.Sprite(tex)

    // tile grid
    let grid = new PIXI.Graphics()
    grid.position.set(0, 0)
    grid.lineStyle(1, 0xffffff)
    for (let ix = 1; ix < nx; ix++)
      grid.moveTo(tile_width*ix, 0).lineTo(tile_width*ix, im_width+1)
    for (let iy = 1; iy < ny; iy++)
      grid.moveTo(0, tile_height*iy).lineTo(im_height+1, tile_height*iy)
    grid.alpha = .1
    
    app.stage.addChild(spr)
    app.stage.addChild(grid)
  },
}
</script>

<style scoped lang='sass'>
@import ../theme
#toolbar
  display: absolute
  height: 24px

  .space
    width: 8px

</style>

