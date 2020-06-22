<template lang='pug'>
#el_tileset_image.full.flex-col
  #toolbar.center
    ui-tooltip(text='Point Tool')
      faicon.icon.toolbar-icon(
        icon='mouse-pointer'
        :class='{selected: o.edit_mode == map_mode.point}'
        @mousedown='set_prop([o, "edit_mode", map_mode.point])'
      )
    .space
    ui-tooltip(text='Rectangle Tool')
      faicon.icon.toolbar-icon(
        :icon='["far", "square"]'
        :class='{selected: o.edit_mode == map_mode.rect}'
        @mousedown='set_prop([o, "edit_mode", map_mode.rect])'
      )
    .space
    ui-tooltip(text='Fill Tool')
      faicon.icon.toolbar-icon(
        icon='fill-drip'
        :class='{selected: o.edit_mode == map_mode.fill}'
        @mousedown='set_prop([o, "edit_mode", map_mode.fill])'
      )
    .space
    ui-tooltip(text='Zoom Out')
      faicon.icon.toolbar-icon(
        icon='search-minus'
        @mousedown='on_save'
      )
    .space
    ui-tooltip(text='Zoom In')
      faicon.icon.toolbar-icon(
        icon='search-plus'
        @mousedown='on_save'
      )
    .space
    ui-tooltip(text='Toggle Grid')
      ui-icon.toolbar-icon(
        icon='grid'
        height='12px'
        text base
        @mousedown='on_save'
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
import { map_mode } from '../const.js'
import { bus } from './editor_tileset.vue'
import { o } from './app.vue'

export default
{
  name: 'ed_map_image',

  data(){
    return {
      map_mode,
    }
  },

  props: {
    o: {},
  },

  computed: {
    ...mapState([
      'itab',
    ]),
    ntiles(){
      return this.tiles.length
    },
  },

  methods: {
    ...mapMutations([
      'set_prop',
    ]),
    on_save(){
    },
  },

  created(){
    // tileset
    this.tw = this.o.ts.tile_w
    this.th = this.o.ts.tile_h
    this.ts_im_w = this.o.ts.im_w // tileset image width
    this.ts_im_h = this.o.ts.im_h
    this.tnx = Math.round(this.ts_im_w/this.tw)
    this.tny = Math.round(this.ts_im_h/this.th)
    
    // map
    this.map_w = this.o.map_w // # tiles along x
    this.map_h = this.o.map_h
    this.s = 1 // scale (zoom)

    this.tiles = Array(this.map_w*this.map_h).fill(-1) // uninitialized
  },

  mounted(){
    let nx = this.map_w * this.tw
      , ny = this.map_h * this.th
    this.$refs.canvas.style.width = `${Math.round(this.s*nx)}px`
    this.$refs.canvas.style.height = `${Math.round(this.s*ny)}px`

    this.app = new PIXI.Application({
      width: this.s*nx,
      height: this.s*ny,
      view: this.$refs.canvas,
      resizeTo: this.$refs.canvas,
      backgroundColor: 0x111111,
      antialias: true,
    })

    // todo: this is copied from ed_tileset_image - maybe move to separate function?
    let base = PIXI.BaseTexture.fromBuffer(this.o.ts.im_data, this.ts_im_w, this.ts_im_h)

    // extract tiles
    o.tabs[this.itab].g_tiles = [] // so it can be shared
    let i = 0
    for (let iy = 0; iy < this.ny; iy++)
      for (let ix = 0; ix < this.nx; ix++)
        o.tabs[this.itab].g_tiles[i++] = new PIXI.Texture(base,
          new PIXI.Rectangle(ix*this.tw, iy*this.th, this.tw, this.th))
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
