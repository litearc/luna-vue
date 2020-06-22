// the animation section of the tileset sidebar.

<template lang='pug'>
#tile_anim
  .flex-row.mt-8px.align-bl
    // the text + combobox for how the animation cycles (beginning to end, back and forth)
    .w-1-2.flex-row.align-bl.pr-8px
      span.bold.mr-8px Cycle
      ui-combobox.expand(
        :items='["Beginning to end", "Back and forth"]'
        :disabled='o.ianim === null'
        v-model='tile_type_model'
      )
    // the text + input to set the frame duration
    .w-1-2.flex-row.align-bl
      span.bold.ws-nowrap.mr-8px.ml-4px Frame duration
      ui-input.expand(
        small
        right
        :disabled='o.ianim === null'
        type='number'
        placeholder='ms'
        v-model='frame_dur_model'
      )
      
  // canvases (animation preview, terra list, tiles list)
  .flex-row.mt-8px.full-w.pos-relative(ref='canvases' style='height: 0px')
    canvas(ref='canvas_preview').mr-8px.fixed(style='width: 0px; height: 0px')
    .expand.pos-absolute(ref='right_part' style='right: 0; left: 0')
      // terra text + canvas
      .span.bold Terra
      .expand.mb-8px.overflow-x-scoll.overflow-y-hidden.ws-nowrap(
        ref='container_terra'
        style='height: 0px; background-color: #1d1e1f'
      )
        canvas(ref='canvas_terra')
      // tiles text + minus button
      .flex-row.align-bl
        span.bold Tiles
        .expand
        ui-tooltip(
          text='Remove'
          placement='left'
        )
          faicon.icon.hover-hl(
            icon='minus'
            @click='on_minus_tiles'
          )
      // tiles canvas
      .expand.overflow-x-scoll.overflow-y-hidden.ws-nowrap(
        ref='container_tiles'
        style='height: 0px; background-color: #1d1e1f'
      )
        canvas(ref='canvas_tiles')

  // anims list
  .flex-row.mt-8px
    .bold.ml-4px Anim
    .expand
    ui-tooltip(
      text='Add'
      placement='left'
    )
      .flex-row.align-bl
        faicon.icon.hover-hl(
          icon='plus'
          @click='on_plus'
        )
  div
    .flex-row.align-bl(
      v-for='(item,i) in o.anims'
    )
      faicon.icon.it-icon(
        icon='tag'
        :class='{selected: o.ianim == i}'
        @mousedown='set_ianim(i)'
      )
      ui-input.invisible.mr-4px(
        small
        v-model='item.name'
        :class='{selected: o.ianim == i, "expand": true}'
      )
      ui-tooltip(
        text='Remove'
        placement='left'
      )
        faicon.icon.hover-hl(
          icon='minus'
          @click='on_minus(i)'
        )
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'
import * as PIXI from 'pixi.js'

import { anim_cycle_type, anim_block_type } from '../const.js'
import { clamp } from '../js/util.js'

import { o } from './app.vue'
import { bus } from './editor_tileset.vue'

export default
{
  name: 'tile_anim',

  props: {
    o: {},
  }, // props

  computed: {
    ...mapState([
      'itab',
    ]),

    // https://stackoverflow.com/questions/35210901/binding-method-result-to-v-model-with-vue-js
    frame_dur_model: {
      get(){
        return (this.o.ianim === null) ? '' : this.o.anims[this.o.ianim].frame_dur
      },
      set(v){
        if (this.o.ianim !== null){
          // todo: figure out a good way to validate the value
          // v = parseInt(v)
          // if (isNaN(v)) return
          // if (v < 1) v = 1
          // this.o.anims[this.o.ianim].frame_dur = String(v)
          this.o.anims[this.o.ianim].frame_dur = v
        }
      },
    },

    tile_type_model: {
      get(){
        return (this.o.ianim === null) ? 0 : this.o.anims[this.o.ianim].cycle_type
      },
      set(v){
        if (this.o.ianim !== null)
          this.o.anims[this.o.ianim].cycle_type = v
      },
    },

    ntiles(){
      return (this.o.ianim === null) ? 0 : this.o.anims[this.o.ianim].tiles.length
    },
  }, // computed

  watch: {
    'o.ianim' : function(){ this.canims = this.o.anims[this.o.ianim] }
  }, // watch

  methods: {
    ...mapMutations([
      'insert',
      'push',
      'remove',
      'set_prop',
    ]),

    // adds new tile to the canvas.
    add_tile_anim(i){
      let spr = new PIXI.Sprite(o.tabs[this.itab_].g_tiles[i])
      spr.x = this.o.anim_pos*this.o.tile_w, spr.y = 0
      this.insert([o.tabs[this.itab_].g_anim_tiles[this.o.ianim], this.o.anim_pos, spr])
      this.upd_canvas_tiles()
      this.o.anim_pos++
    },

    // removes all children from an app.
    clear_app(app){
      for (let i = app.stage.children.length-1; i >= 0; i--)
        app.stage.removeChildAt(i)
    },

    // adds a new terra to list of tiles.
    on_click_terra(e){
      if (this.o.ianim === null) return
      let block_type = this.canims.block_type
      // if the current block type is not terra, return
      if (block_type !== anim_block_type.not_set && block_type !== anim_block_type.terra)
        return
      this.set_prop([this.canims, 'block_type', anim_block_type.terra])
      let nx = Math.round(this.o.im_w/this.o.tile_w)
      let terra = clamp(Math.floor(e.offsetX/this.o.tile_w), 0, this.o.terra.length-1)
      let itile = this.o.terra[iterra].pos.y*nx + this.o.terra[iterra].pos.x
      this.insert([this.canims.tiles, this.o.anim_pos, itile])
      this.add_tile_anim(itile)
    },

    // add an anim - if it's the first one, set the anim index to that.
    on_plus(){
      this.push([this.o.anims, {
        name: 'new anim',
        tiles: [],
        frame_dur: 200,
        cycle_type: anim_cycle_type.beg_to_end,
        block_type: anim_block_type.not_set,
      }])
      this.push([o.tabs[this.itab_].g_anim_tiles, []])
      if (this.o.anims.length == 1){
        this.set_prop([this.o, 'ianim', 0])
        this.telap = 0
      }
      this.upd_canvas_tiles()
    },

    // remove an anim and update the anim index if necessary.
    on_minus(i){
      this.remove([this.o.anims, i])
      if (this.o.anims.length == 0){
        this.set_prop([this.o, 'ianim', null])
        this.set_prop([this.o, 'anim_pos', 0])
      }
      else if (this.o.ianim >= this.o.anims.length){
        this.set_prop([this.o, 'ianim', this.o.anims.length-1])
        this.set_prop([this.o, 'anim_pos', 0])
        this.telap = 0
      }
      this.upd_canvas_tiles()
    },

    // remove a tile from the animation list.
    on_minus_tiles(){
      let n = this.ntiles
      if (n === 0) return
      this.remove([this.o.anims[this.o.ianim].tiles, n-1])
      this.remove([o.tabs[this.itab_].g_anim_tiles[this.o.ianim], n-1])
      this.upd_canvas_tiles()
      this.o.anim_pos--
      if (this.o.anim_pos === 0)
        this.set_prop([this.canims, 'block_type', anim_block_type.not_set])
    },

    // set current animation index.
    set_ianim(i){
      if (i === this.o.ianim) return
      this.set_prop([this.o, 'ianim', i])
      this.set_prop([this.o, 'anim_pos', this.ntiles])
      this.upd_canvas_tiles()
      this.telap = 0
    },

    // resets the tiles canvas so that it is in sync with the tiles data.
    upd_canvas_tiles(){
      let n = (this.o.ianim === null) ? 0 : this.ntiles
      this.$refs.canvas_tiles.style.width = `${this.o.tile_w*n}px`
      this.$refs.canvas_tiles.style.height = `${this.o.tile_h}px`
      this.clear_app(this.app_tiles)
      this.app_tiles.resize()
      if (this.o.ianim === null) return
      for (let i = 0; i < n; i++)
        this.app_tiles.stage.addChild(o.tabs[this.itab_].g_anim_tiles[this.o.ianim][i])
    },
  }, // methods

  created(){
    bus.$on('add_tile_anim', this.add_tile_anim)
    this.app_tiles   = null
    this.app_preview = null
    this.app_terra   = null
    this.telap       = 0
    this.iframe      = 0
    // store the index of the tab when this tab is created. we don't want to
    // refer to this.itab in the animation ticker loop since it will produce
    // errors when you switch tabs.
    this.itab_       = this.itab
    this.canims      = this.o.anims[this.o.ianim]
  }, // created

  mounted(){
    // the heights of the terra and tiles canvases are the tile heights, which
    // are used to determine the size of the preview canvas

    let nterra = this.o.terra.length
    let nanims = (this.o.ianim === null) ? 0 : this.canims.tiles.length
    this.$refs.canvas_tiles.style.width = `${this.o.tile_w*nanims}px`
    this.$refs.canvas_tiles.style.height = `${this.o.tile_h}px`
    this.$refs.canvas_terra.style.width = `${this.o.tile_w*nterra}px`
    this.$refs.canvas_terra.style.height = `${this.o.tile_h}px`
    this.$refs.container_tiles.style.height = `${this.o.tile_h}px`
    this.$refs.container_terra.style.height = `${this.o.tile_h}px`
    let n = this.$refs.right_part.offsetHeight
    this.$refs.canvas_preview.style.width = `${n}px`
    this.$refs.canvas_preview.style.height = `${n}px`
    this.$refs.canvases.style.height = `${n}px`
    this.$refs.right_part.style.left = `${n+8}px`

    this.app_tiles = new PIXI.Application({
      width: this.o.tile_w*nanims,
      height: this.o.tile_h,
      view: this.$refs.canvas_tiles,
      resizeTo: this.$refs.canvas_tiles,
      antialias: true,
      backgroundColor: 0x1d1e1f,
    })
    this.upd_canvas_tiles()

    this.app_terra = new PIXI.Application({
      width: this.o.tile_w*nterra,
      height: this.o.tile_h,
      view: this.$refs.canvas_terra,
      resizeTo: this.$refs.canvas_terra,
      antialias: true,
      backgroundColor: 0x1d1e1f,
    })
    this.app_terra.view.addEventListener('mousedown', this.on_click_terra)

    this.app_preview = new PIXI.Application({
      width: n,
      height: n,
      view: this.$refs.canvas_preview,
      antialias: true,
      backgroundColor: 0x1d1e1f,
    })

    // animate the animation canvas.
    this.app_preview.ticker.add(d => {
      if (this.ntiles === 0){
        this.clear_app(this.app_preview)
        return
      }
      let i
      let do_upd = false
      if (this.telap === 0) do_upd = true // update after switching anims
      this.telap += this.app_preview.ticker.elapsedMS
      let cyc_type = this.canims.cycle_type
      // set the index of current frame depending on the animation type.
      switch (cyc_type){
        case anim_cycle_type.beg_to_end:
          i = Math.floor(this.telap/this.canims.frame_dur) % this.ntiles
          break
        case anim_cycle_type.back_and_forth:
          i = Math.floor(this.telap/this.canims.frame_dur) % (2*this.ntiles-2)
          if (i >= this.ntiles) i = (2*this.ntiles-2) - i
          break
      }
      if (!do_upd && i !== this.iframe) do_upd = true
      if (do_upd){
        this.iframe = i
        this.clear_app(this.app_preview)
        let itile = this.canims.tiles[this.iframe]
        let spr = new PIXI.Sprite(o.tabs[this.itab_].g_tiles[itile])
        spr.width = n, spr.height = n
        this.app_preview.stage.addChild(spr)
      }
    })

  }, // mounted

  // life-cycle hooks for when dynamic component is activated/deactivated.
  // syncs terra canvas with terra data (since user may have changed terra data
  // when switching to a different tileset mode.
  activated(){
    this.app_preview.ticker.start()
    let nx = Math.round(this.o.im_w/this.o.tile_w)
    this.$refs.canvas_terra.style.width = `${this.o.tile_w*this.o.terra.length}px`
    this.$refs.canvas_terra.style.height = `${this.o.tile_h}px`
    this.clear_app(this.app_terra)
    this.app_terra.resize() // weird, this seems to be what's needed to update the renderer
    for (let i = 0; i < this.o.terra.length; i++){
      let iterra = this.o.terra[i].pos.y*nx + this.o.terra[i].pos.x
      let spr = new PIXI.Sprite(o.tabs[this.itab_].g_tiles[iterra])
      spr.x = this.o.tile_w*i, spr.y = 0
      this.app_terra.stage.addChild(spr)
    }
  }, // activated
  deactivated(){
    this.app_preview.ticker.stop()
  }, // deactivated
  beforeDestroy(){
    this.app_terra.view.removeEventListener('mousedown', this.on_click_terra)
    bus.$off('add_tile_anim', this.add_tile_anim)
  } // beforeDestroy
}
</script>

<style scoped lang='sass'>
@import ../theme

.selected:not(:focus)
  color: $c-blue
</style>
