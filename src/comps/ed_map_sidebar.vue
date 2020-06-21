<template lang='pug'>
#ed_map_sidebar
  .bold.full-w.text-center TILESET
  #tileset.expand.flex.overflow-auto.mt-8px
    canvas#canvas-tileset.no-shrink.block.margin-auto(ref='canvas_tileset')
  .hdivider
  div
    .map-title.mr-8px
      div ANIMS
      #anims.expand.flex.overflow-auto.mt-8px(
        style='background-color: #1d1e1f'
      )
        canvas#canvas-anims.no-shrink.block(ref='canvas_anims')
    .map-title.ml-8px
      div TERRA
      #terra.expand.flex.overflow-auto.mt-8px(
        style='background-color: #1d1e1f'
      )
        canvas#canvas-terra.no-shrink.block(ref='canvas_terra')
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'
import { set_g_tiles, set_g_anim_tiles } from './tabs.vue'
import * as PIXI from 'pixi.js'
import { o } from './app.vue'

export default
{
  name: 'ed_map_sidebar',

  props: {
    o: {},
  },

  computed: {
    ...mapState([
      'itab',
    ])
  },

  created(){
    this.tw = this.o.ts.tile_w
    this.th = this.o.ts.tile_h
    this.ts_im_w = this.o.ts.im_w // tileset image width
    this.ts_im_h = this.o.ts.im_h
    this.tnx = Math.round(this.ts_im_w/this.tw)
    this.tny = Math.round(this.ts_im_h/this.th)

    this.base = PIXI.BaseTexture.fromBuffer(this.o.ts.im_data, this.ts_im_w, this.ts_im_h)
    let tex = new PIXI.Texture(this.base)
    this.im_tileset = new PIXI.Sprite(tex)

    this.grid = new PIXI.Graphics()
    this.grid.lineStyle(1, 0xffffff)
    for (let i = 1; i < this.tnx; i++)
      this.grid.moveTo(this.tw*i, 0).lineTo(this.tw*i, this.ts_im_h+1)
    for (let i = 1; i < this.tny; i++)
      this.grid.moveTo(0, this.th*i).lineTo(this.ts_im_w+1, this.th*i)
    this.grid.alpha = .15
  },

  mounted(){
    let nanims = this.o.ts.anims.length
    let nterra = this.o.ts.terra.length

    this.$refs.canvas_tileset.style.width = `${this.ts_im_w}px`
    this.$refs.canvas_tileset.style.height = `${this.ts_im_h}px`
    this.$refs.canvas_anims.style.width = `${this.tw*nanims}px`
    this.$refs.canvas_anims.style.height = `${this.th}px`
    this.$refs.canvas_terra.style.width = `${this.tw*nterra}px`
    this.$refs.canvas_terra.style.height = `${this.th}px`

    this.app_tileset = new PIXI.Application({
      width: this.ts_im_w,
      height: this.ts_im_h,
      view: this.$refs.canvas_tileset,
      resizeTo: this.$refs.canvas_tileset,
      antialias: true,
    })

    this.app_tileset.stage.addChild(this.im_tileset)
    this.app_tileset.stage.addChild(this.grid)
    this.app_tileset.stage.addChild(this.grid)

    this.app_anims = new PIXI.Application({
      width: this.tw*nanims,
      height: this.th,
      view: this.$refs.canvas_anims,
      resizeTo: this.$refs.canvas_anims,
      antialias: true,
    })

    this.app_terra = new PIXI.Application({
      width: this.tw*nterra,
      height: this.th,
      view: this.$refs.canvas_terra,
      resizeTo: this.$refs.canvas_terra,
      antialias: true,
    })

    // for some reason, if I add this in `created`, g_tiles length is 0 here
    set_g_tiles(this.itab, this.base, this.tnx, this.tny, this.tw, this.th)
    set_g_anim_tiles(this.itab, this.o.ts.anims, this.tw)

    for (let i = 0; i < this.o.ts.terra.length; i++){
      let iterra = this.o.ts.terra[i].pos.y*this.tnx + this.o.ts.terra[i].pos.x
      let spr = new PIXI.Sprite(o.tabs[this.itab].g_tiles[iterra])
      spr.x = this.tw*i, spr.y = 0
      this.app_terra.stage.addChild(spr)
    }

    for (let i = 0; i < this.o.ts.anims.length; i++){
      let spr = o.tabs[this.itab].g_anim_tiles[i][0] // show first tile in anim
      spr.x = this.tw*i, spr.y = 0
      this.app_anims.stage.addChild(spr)
    }
  },
}
</script>

<style scoped lang='sass'>
@import ../theme
#ed_map_sidebar
  padding: 12px
  width: 100%
  height: 100%
  background-color: $c-bg-pane

.map-title
  width: calc(50% - 8px)
  display: inline-block
  font-weight: bold
  text-align: center
</style>

