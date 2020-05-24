<template lang='pug'>
#tile_anim
  .flex-row.mt-8px
    div.mr-8px
      // make the canvas zero-size so it doesn't expand the flex-row -
      // we use the height of the flex-row to set the canvas dimensions
      canvas.zero-size(ref='canvas_preview')
    div.expand(ref='right')
      .flex-row.align-bl
        // ui-checkbox.mt-8px.mr-8px(
        //   :items='["Use one duration for all frames"]'
        //   @clicked='use_one_dur = arguments[0]'
        // )
        span.mr-8px.ml-4px Frame duration
        ui-input.expand(
          small
          right
          :disabled='o.ianim === null'
          type='number'
          placeholder='ms'
          v-model='frame_dur_model'
        )

      .flex-row.full-w.align-center.mt-8px
        canvas.no-shrink.block.expand.mr-8px(ref='canvas')
        ui-tooltip(
          text='Remove'
          placement='left'
        )
          faicon.icon.hover-hl(
            icon='minus'
          )

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
let app, app_preview, ianim
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
        return (o.ianim === null) ? '' : o.anims[o.ianim].frame_dur
      },
      set(v){
        if (o.ianim !== null)
          o.anims[o.ianim].frame_dur = v
      },
    },
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
      }])
      if (o.anims.length == 1)
        this.set_prop([o, 'ianim', 0])
    },
    on_minus(i){
      if (o.anims.length == 0)
        this.set_prop([o, 'ianim', null])
      else if (o.ianim >= o.anims.length)
        this.set_prop([o, 'ianim', o.anims.length-1])
      this.remove([o.anims, i])
    },
    set_ianim(i){
      this.set_prop([o, 'ianim', 1])
    }
  },

  created(){
    o = this.o
    let ianim = (o.anims.length > 0) ? 0 : null
    this.set_prop([o, 'ianim', ianim])
  },

  mounted(){
    let nanims = (ianim === null) ? 0 : nanims = o.anims[ianim].tiles.length
    let nx = nanims*o.tile_w
    let ny = o.tile_h
    this.$refs.canvas.style.width = `${nx}px`
    this.$refs.canvas.style.height = `${ny}px`

    app = new PIXI.Application({
      width: nx,
      height: ny,
      view: this.$refs.canvas,
      antialias: true,
      backgroundColor: 0x1d1e1f,
    })

    let h = this.$refs.right.offsetHeight-1 // not sure why the -1 is needed
    this.$refs.canvas_preview.style.width = `${h}px`
    this.$refs.canvas_preview.style.height = `${h}px`
    app_preview = new PIXI.Application({
      width: h,
      height: h,
      view: this.$refs.canvas_preview,
      antialias: true,
      backgroundColor: 0x1d1e1f,
    })
  }
}
</script>

<style scoped lang='sass'>
@import ../theme

.selected:not(:focus)
  color: $c-blue
</style>

