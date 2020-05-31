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
            @click='on_minus'
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
let app_tiles, app_preview, app_terra
let tile_sprites = []
let terra_sprites = []
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
    nframes(n, prev){
      console.log('nframes changed')
      if (n > prev){ // inserted a tile
        // need to do 3 things:
        // - resize the canvas
        // - insert new sprite (addChildAt)
        // - reposition tiles (from insertion point onwards)
        let itile = o.anims[o.ianim].tiles[o.anim_pos]
        let spr = new PIXI.Sprite(o.g_tiles[itile]) // o.anims[o.ianim].g_tiles[o.anim_pos]
        this.insert([o.anims[o.ianim].g_tiles, o.anim_pos, spr])
        spr.x = o.anim_pos*o.tile_w
        spr.y = 0
        this.$refs.canvas_tiles.style.width = `${o.tile_w*n}px`
        this.$refs.canvas_tiles.style.height = `${o.tile_h}px`
        app_tiles.resize()
        app_tiles.stage.addChild(spr)
        o.anim_pos++
      }
      else { // removed a tile
      }
    }
  },

  methods: {
    ...mapMutations([
      'insert',
      'push',
      'remove',
      'set_prop',
    ]),
    on_plus(){
      this.push([o.anims, {
        name: 'new anim',
        tiles: [],
        g_tiles: [],
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

    app_terra = new PIXI.Application({
      width: o.tile_w*nterra,
      height: o.tile_h,
      view: this.$refs.canvas_terra,
      antialias: true,
      backgroundColor: 0x1d1e1f,
    })

    app_preview = new PIXI.Application({
      width: n,
      height: n,
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

