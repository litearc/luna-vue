<template lang='pug'>
#tile_anim
  .flex-row.mt-8px.align-bl
    .w-1-2.flex-row.align-bl.pr-8px
      span.bold.mr-8px Type
      ui-combobox.expand(
        :items='["Tiles", "Terra"]'
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
      
  .flex-row.mt-8px.border-gold.full-w.pos-relative(ref='canvases' style='height: 120px')
    canvas(ref='canvas_preview').border-blue.mr-8px.fixed(style='width: 40px; height: 40px')
    .border-red.expand.pos-absolute(ref='right_part' style='right: 0; left: 48px')
      .span.bold Terra
      .border-gold.expand.mb-8px.overflow-x-scoll.overflow-y-hidden.ws-nowrap(style='height: 20px')
        canvas.border-blue(ref='canvas_terra')
      .flex-row.align-bl
        span.bold Tiles
        .expand
        ui-tooltip(
          text='Remove'
          placement='left'
        )
          faicon.icon.hover-hl(
            icon='minus'
            @click='on_minus'
          )
      .border-gold.expand.overflow-x-scoll.overflow-y-hidden.ws-nowrap(style='height: 20px')
        canvas.border-blue(ref='canvas_tiles')

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
let app_tiles, app_preview, app_terra
let tile_sprites = []
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
        if (this.o.ianim !== null)
          this.o.anims[this.o.ianim].frame_dur = v
      },
    },
    tile_type_model: {
      get(){
        return (this.o.ianim === null) ? 0 : this.o.anims[this.o.ianim].type_id
      },
      set(v){
        if (this.o.ianim !== null)
          this.o.anims[this.o.ianim].type_id = v
      },
    },
    nframes(){
      return (this.o.ianim === null) ? 0 : this.o.anims[this.o.ianim].tiles.length
    },
  },

  watch: {
    nframes(v){
    }
  },

  methods: {
    ...mapMutations([
      'push',
      'remove',
      'set_prop',
    ]),
    on_plus(){
      this.push([o.anims, {
        name: 'new anim',
        tiles: [],
        frame_dur: 200,
        type_id: 0,
      }])
      if (o.anims.length == 1)
        this.set_prop([o, 'ianim', 0])
    },
    on_minus(i){
      this.remove([o.anims, i])
      if (o.anims.length == 0)
        this.set_prop([o, 'ianim', null])
      else if (o.ianim >= o.anims.length)
        this.set_prop([o, 'ianim', o.anims.length-1])
    },
    set_ianim(i){
      this.set_prop([o, 'ianim', i])
    },
  },

  created(){
    o = this.o
    let ianim = (o.anims.length > 0) ? 0 : null
    this.set_prop([o, 'ianim', ianim])
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
    let n = this.$refs.right_part.offsetHeight
    this.$refs.canvas_preview.style.width = `${n}px`
    this.$refs.canvas_preview.style.height = `${n}px`
    this.$refs.canvases.style.height = `${n}px`
    this.$refs.right_part.style.left = `${n+8}px`
  }
}
</script>

<style scoped lang='sass'>
@import ../theme

.selected:not(:focus)
  color: $c-blue
</style>

