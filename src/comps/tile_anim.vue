<template lang='pug'>
#tile_anim
  .flex-row.mt-8px.align-bl
    .w-1-2.flex-row.align-bl.pr-8px
      span.bold.mr-8px Cycle
      ui-combobox.expand(
        :items='["Beginning to end", "Back and forth"]'
        :disabled='o.ianim === null'
        v-model='tile_type_model'
      )
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
      
  .flex-row.mt-8px.full-w.pos-relative(ref='canvases' style='height: 0px')
    canvas(ref='canvas_preview').mr-8px.fixed(style='width: 0px; height: 0px')
    .expand.pos-absolute(ref='right_part' style='right: 0; left: 0')
      .span.bold Terra
      .expand.mb-8px.overflow-x-scoll.overflow-y-hidden.ws-nowrap(
        ref='container_terra'
        style='height: 0px; background-color: #1d1e1f'
      )
        canvas(ref='canvas_terra')
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
      .expand.overflow-x-scoll.overflow-y-hidden.ws-nowrap(
        ref='container_tiles'
        style='height: 0px; background-color: #1d1e1f'
      )
        canvas(ref='canvas_tiles')

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
import { bus } from './editor_tileset.vue'
import { anim_cycle_type, anim_block_type } from '../const.js'
let app_tiles, app_preview, app_terra
let telap, iframe // time elapsed (ms) - used for preview animation
let o

export default
{
  name: 'tile_anim',

  props: {
    o: {},
  },

  computed: {
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
  },

  methods: {
    ...mapMutations([
      'insert',
      'push',
      'remove',
      'set_prop',
    ]),
    add_tile_anim(i){
      let spr = new PIXI.Sprite(o.g_tiles[i])
      spr.x = o.anim_pos*o.tile_w, spr.y = 0
      this.insert([o.anims[o.ianim].g_tiles, o.anim_pos, spr])
      this.upd_canvas_tiles()
      o.anim_pos++
    },
    clear_app(app){
      for (let i = app.stage.children.length-1; i >= 0; i--)
        app.stage.removeChildAt(i)
    },
    on_click_terra(e){
      if (o.ianim === null) return
      let block_type = o.anims[o.ianim].block_type
      if (block_type !== anim_block_type.not_set && block_type !== anim_block_type.terra)
        return
      this.set_prop([o.anims[o.ianim], 'block_type', anim_block_type.terra])
      let nx = Math.round(o.im_w/o.tile_w)
      let iterra = Math.floor(e.offsetX/o.tile_w)
      let itile = o.terra[iterra].pos.y*nx + o.terra[iterra].pos.x
      this.insert([o.anims[o.ianim].tiles, o.anim_pos, itile])
      this.add_tile_anim(itile)
      // rest is handles by the watcher for `ntiles`
    },
    on_plus(){
      this.push([o.anims, {
        name: 'new anim',
        tiles: [],
        g_tiles: [],
        frame_dur: 200,
        cycle_type: anim_cycle_type.beg_to_end,
        block_type: anim_block_type.not_set,
      }])
      if (o.anims.length == 1){
        this.set_prop([o, 'ianim', 0])
        telap = 0
      }
      this.upd_canvas_tiles()
    },
    on_minus(i){
      this.remove([o.anims, i])
      if (o.anims.length == 0){
        this.set_prop([o, 'ianim', null])
        this.set_prop([o, 'anim_pos', 0])
      }
      else if (o.ianim >= o.anims.length){
        this.set_prop([o, 'ianim', o.anims.length-1])
        this.set_prop([o, 'anim_pos', 0])
        telap = 0
      }
      this.upd_canvas_tiles()
    },
    on_minus_tiles(){
      let n = this.ntiles
      if (n === 0) return
      this.remove([o.anims[o.ianim].tiles, n-1])
      this.remove([o.anims[o.ianim].g_tiles, n-1])
      this.upd_canvas_tiles()
      o.anim_pos--
      if (o.anim_pos === 0)
        this.set_prop([o.anims[o.ianim], 'block_type', anim_block_type.not_set])
    },
    set_ianim(i){
      if (i === o.ianim) return
      this.set_prop([o, 'ianim', i])
      this.set_prop([o, 'anim_pos', this.ntiles])
      this.upd_canvas_tiles()
      telap = 0
    },
    upd_canvas_tiles(){
      let n = (o.ianim === null) ? 0 : this.ntiles
      this.$refs.canvas_tiles.style.width = `${o.tile_w*n}px`
      this.$refs.canvas_tiles.style.height = `${o.tile_h}px`
      this.clear_app(app_tiles)
      app_tiles.resize()
      if (o.ianim === null) return
      for (let i = 0; i < n; i++)
        app_tiles.stage.addChild(o.anims[o.ianim].g_tiles[i])
    },
  },

  created(){
    o = this.o
    let ianim = (o.anims.length > 0) ? 0 : null
    this.set_prop([o, 'ianim', ianim])
    bus.$on('add_tile_anim', this.add_tile_anim)
  },

  mounted(){
    // the heights of the terra and tiles canvases are the tile heights, which
    // are used to determine the size of the preview canvas

    let nterra = o.terra.length
    let nanims = (o.ianim === null) ? 0 : o.anims[o.ianim].tiles.length
    this.$refs.canvas_tiles.style.width = `${o.tile_w*nanims}px`
    this.$refs.canvas_tiles.style.height = `${o.tile_h}px`
    this.$refs.canvas_terra.style.width = `${o.tile_w*nterra}px`
    this.$refs.canvas_terra.style.height = `${o.tile_h}px`
    this.$refs.container_tiles.style.height = `${o.tile_h}px`
    this.$refs.container_terra.style.height = `${o.tile_h}px`
    let n = this.$refs.right_part.offsetHeight
    this.$refs.canvas_preview.style.width = `${n}px`
    this.$refs.canvas_preview.style.height = `${n}px`
    this.$refs.canvases.style.height = `${n}px`
    this.$refs.right_part.style.left = `${n+8}px`

    app_tiles = new PIXI.Application({
      width: o.tile_w*nanims,
      height: o.tile_h,
      view: this.$refs.canvas_tiles,
      resizeTo: this.$refs.canvas_tiles,
      antialias: true,
      backgroundColor: 0x1d1e1f,
    })
    // todo: add tiles in data

    app_terra = new PIXI.Application({
      width: o.tile_w*nterra,
      height: o.tile_h,
      view: this.$refs.canvas_terra,
      resizeTo: this.$refs.canvas_terra,
      antialias: true,
      backgroundColor: 0x1d1e1f,
    })
    app_terra.view.addEventListener('mousedown', this.on_click_terra)

    app_preview = new PIXI.Application({
      width: n,
      height: n,
      view: this.$refs.canvas_preview,
      antialias: true,
      backgroundColor: 0x1d1e1f,
    })
    app_preview.ticker.add(d => {
      if (this.ntiles === 0){
        this.clear_app(app_preview)
        return
      }
      let i
      let do_upd = false
      if (telap === 0) do_upd = true // update after switching anims
      telap += app_preview.ticker.elapsedMS
      let cyc_type = o.anims[o.ianim].cycle_type
      switch (cyc_type){
        case anim_cycle_type.beg_to_end:
          i = Math.floor(telap/o.anims[o.ianim].frame_dur) % this.ntiles
          break
        case anim_cycle_type.back_and_forth:
          i = Math.floor(telap/o.anims[o.ianim].frame_dur) % (2*this.ntiles-2)
          if (i >= this.ntiles) i = (2*this.ntiles-2) - i
          break
      }
      if (!do_upd && i !== iframe) do_upd = true
      if (do_upd){
        iframe = i
        this.clear_app(app_preview)
        let itile = o.anims[o.ianim].tiles[iframe]
        let spr = new PIXI.Sprite(o.g_tiles[itile])
        spr.width = n, spr.height = n
        app_preview.stage.addChild(spr)
      }
    })

  },

  // life-cycle hooks for when dynamic component is activated/deactivated
  activated(){
    let nx = Math.round(o.im_w/o.tile_w)
    this.$refs.canvas_terra.style.width = `${o.tile_w*o.terra.length}px`
    this.$refs.canvas_terra.style.height = `${o.tile_h}px`
    this.clear_app(app_terra)
    app_terra.resize() // weird, this seems to be what's needed to update the renderer
    for (let i = 0; i < o.terra.length; i++){
      let iterra = o.terra[i].pos.y*nx + o.terra[i].pos.x
      let spr = new PIXI.Sprite(o.g_tiles[iterra])
      spr.x = o.tile_w*i, spr.y = 0
      app_terra.stage.addChild(spr)
    }
  },

  beforeDestroy(){
    bus.$off('add_tile_anim', this.add_tile_anim)
  }
}
</script>

<style scoped lang='sass'>
@import ../theme

.selected:not(:focus)
  color: $c-blue
</style>

