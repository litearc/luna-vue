<template lang='pug'>
#tile_anim
  .flex-row.mt-8px.align-bl
    .w-1-2.flex-row.align-bl.pr-8px
      span.mr-8px Type
      ui-combobox.expand(
        :items='["Tiles", "Terra"]'
        :disabled='o.ianim === null'
        v-model='tile_type_model'
      )
    .w-1-2.flex-row.align-bl
      span.ws-nowrap.mr-8px.ml-4px Frame duration
      ui-input.expand(
        small
        right
        :disabled='o.ianim === null'
        type='number'
        placeholder='ms'
        v-model='frame_dur_model'
      )
      
  .flex-row.mt-8px
    // make the canvas zero-size so it doesn't expand the flex-row -
    // we use the height of the flex-row to set the canvas dimensions
    canvas.zero-size.mr-8px(ref='canvas_preview')
    .expand(ref='right')
      .flex-row
        canvas.zero-size.expand(ref='canvas_terra')
      .flex-row.full-w.align-center.mt-8px
        canvas.no-shrink.block.mr-8px(ref='canvas_tiles')
        .expand
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
let app_tiles, app_preview, app_terra
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
    }
  },

  watch: {
    nframes(v){
      console.log('changed number of tiles')
      console.log(o.g_tiles[0])
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
    }
  },

  created(){
    o = this.o
    let ianim = (o.anims.length > 0) ? 0 : null
    this.set_prop([o, 'ianim', ianim])
  },

  mounted(){
    let nanims = (o.ianim === null) ? 0 : o.anims[ianim].tiles.length
    let nx = nanims*o.tile_w
    let ny = o.tile_h
    nx = 16, ny = 16
    this.$refs.canvas_tiles.style.width = `${nx}px`
    this.$refs.canvas_tiles.style.height = `${ny}px`
    this.$refs.canvas_terra.style.width = `${nx}px`
    this.$refs.canvas_terra.style.height = `${ny}px`

    app_terra = new PIXI.Application({
      width: nx,
      height: ny,
      view: this.$refs.canvas_terra,
      antialias: true,
      backgroundColor: 0x1d1e1f,
    })

    app_tiles = new PIXI.Application({
      width: nx,
      height: ny,
      view: this.$refs.canvas_tiles,
      antialias: true,
      backgroundColor: 0x1d1e1f,
    })
    this.$refs.canvas_tiles.style.width = '16px'
    this.$refs.canvas_tiles.style.height = '16px'
    app_tiles.stage.addChild(new PIXI.Sprite(o.g_tiles[0]))

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

