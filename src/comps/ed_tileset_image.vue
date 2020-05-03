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
      pub: process.env.BASE_URL
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

  mounted(){
    // let tex = PIXI.Texture.from(`${this.pub}hummingbird.png`)
    let { im_data, im_width, im_height } = this.tabs[this.itab].data
    app = new PIXI.Application({width: im_width, height: im_height})
    this.$refs.root.appendChild(app.view)
    let tex = PIXI.Texture.fromBuffer(im_data, im_width, im_height)
    let spr = new PIXI.Sprite(tex)
    app.stage.addChild(spr)
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

