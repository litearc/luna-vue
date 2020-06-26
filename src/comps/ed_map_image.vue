<template lang='pug'>
#el_tileset_image.full.flex-col
  // toolbar at the top - contains options to select the editing tool,
  // zoom options, ...
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

  // container and canvas used to render the map
  #image-container.expand.flex.overflow-auto
    canvas#canvas.no-shrink.block.margin-auto(
      ref='canvas'
      @mousedown='on_mousedown'
      @mousemove='on_mousemove'
      @mouseout='on_mouseout'
      @mouseenter='on_mouseenter'
    )
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'
import * as PIXI from 'pixi.js'

import { clamp } from '../js/util.js'
import { map_mode } from '../const.js'
import { o } from './app.vue'
import { bus } from './editor_tileset.vue'
import { set_g_tiles } from './tabs.vue'

export default
{
  name: 'ed_map_image',

  data(){
    return {
      map_mode,
      s : 1, // scale (zoom)
    }
  }, // data

  props: {
    o: {},
  }, // props

  computed: {
    ...mapState([
      'itab',
    ]),
    stw(){ return this.s*this.tw },
    sth(){ return this.s*this.th },
    ntiles(){
      return this.tiles.length
    },
  }, // computed

  methods: {
    ...mapMutations([
      'set_prop',
    ]),

    on_mousedown(e){
    },

    on_mousemove(e){
      if (!this.sel_tiles.visible) this.sel_tiles.visible = true
      this.ix = clamp(Math.floor(e.offsetX/this.stw), 0, this.map_w-1)
      this.iy = clamp(Math.floor(e.offsetY/this.sth), 0, this.map_h-1)
      this.sel_tiles.x = this.ix*this.stw
      this.sel_tiles.y = this.iy*this.sth
    },

    on_mouseout(e){
      this.sel_tiles.visible = false
    },

    on_mouseenter(e){
      this.sel_tiles.texture = o.tabs[this.itab_].g_sel_tiles
      this.sel_tiles.visible = true
    },

    on_save(){
    },
  }, // methods

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

    this.itab_ = this.itab
    this.tiles = Array(this.map_w*this.map_h).fill(-1) // uninitialized
  }, // created

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

    this.sel_tiles = new PIXI.Sprite(o.tabs[this.itab].g_tiles[0])
    this.sel_tiles.alpha = .5
    this.app.stage.addChild(this.sel_tiles)
    this.sel_tiles.x = 0
    this.sel_tiles.y = 0
    this.sel_tiles.visible = false
  }, // mounted

  // activated(){
  //   bus.$on('sel_tiles_changed', this.on_sel_tiles_changed)
  // }, // activated
  //
  // deactivated(){
  //   bus.$off('sel_tiles_changed', this.on_sel_tiles_changed)
  // }, // deactivated
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
