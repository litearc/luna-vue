<template lang='pug'>
#ed_map_sidebar
  .bold.full-w.text-center TILESET
  #tileset.expand.flex.overflow-auto.mt-8px
    canvas#canvas-tileset.no-shrink.block.margin-auto(
      ref='canvas_tileset'
      @mousedown='on_mousedown_tileset'
      @mouseup='on_mouseup_tileset'
      @mousemove='on_mousemove_tileset'
      @mouseout='on_mouseout_tileset'
    )
  .hdivider
  div
    .map-title.mr-8px
      div ANIMS
      #anims.expand.flex.overflow-auto.mt-8px(
        style='background-color: #1d1e1f'
      )
        canvas#canvas-anims.no-shrink.block(
          ref='canvas_anims'
          @mousedown='on_mousedown_anims'
        )
    .map-title.ml-8px
      div TERRA
      #terra.expand.flex.overflow-auto.mt-8px(
        style='background-color: #1d1e1f'
      )
        canvas#canvas-terra.no-shrink.block(
          ref='canvas_terra'
          @mousedown='on_mousedown_terra'
        )
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'
import * as PIXI from 'pixi.js'

import { o } from './app.vue'
import { draw_box, draw_grid } from '../js/image.js'
import { set_g_tiles, set_g_anim_tiles } from './tabs.vue'
import { clamp } from '../js/util.js'

const canvas = {
  tileset: 0,
  anims: 1,
  terra: 2,
}

export default
{
  name: 'ed_map_sidebar',

  data(){
    return {
      ix0 : 0, // selection (x, y) position on mousedown
      iy0 : 0,
      ix1 : 0, // " position on mouseup
      iy1 : 0,
      s: 1,
      mousedown: false,
    }
  },

  props: {
    o: {},
  }, // props

  computed: {
    ...mapState([
      'itab',
    ]),
    stw(){ return this.s*this.tw },
    sth(){ return this.s*this.th },
    isx(){ return Math.min(this.ix0, this.ix1) }, // index of top-left tile of sel
    isy(){ return Math.min(this.iy0, this.iy1) },
    sw(){ return Math.abs(this.ix0-this.ix1)+1 }, // w/h of selection (# tiles)
    sh(){ return Math.abs(this.iy0-this.iy1)+1 },
  }, // computed

  watch: {
    sw(v){ if (this.curr_canvas === canvas.tileset) this.upd_cursor() },
    sh(v){ if (this.curr_canvas === canvas.tileset) this.upd_cursor() },
  },

  methods: {
    get_ixy(e){
      return [
        clamp(Math.floor(e.offsetX/this.stw), 0, this.tnx-1),
        clamp(Math.floor(e.offsetY/this.sth), 0, this.tny-1)
      ]
    },

    on_mousedown_tileset(e){
      this.prev_canvas = this.curr_canvas
      this.curr_canvas = canvas.tileset
      this.set_ixy(e)
      this.mousedown = true
      this.sel_type = canvas.tileset
    },
    on_mouseup_tileset(e){
      this.mousedown = false
    },
    on_mouseout_tileset(e){
      this.mousedown = false
    },
    on_mousemove_tileset(e){
      if (this.mousedown){
        let [ix, iy] = this.get_ixy(e)
        this.ix1 = ix
        this.iy1 = iy
      }
    },

    on_mousedown_anims(e){
      this.prev_canvas = this.curr_canvas
      this.curr_canvas = canvas.anims
      this.set_ixy(e)
      this.sel_type = canvas.anims
      this.upd_cursor()
    },

    on_mousedown_terra(e){
      this.prev_canvas = this.curr_canvas
      this.curr_canvas = canvas.terra
      this.set_ixy(e)
      this.sel_type = canvas.terra
      this.upd_cursor()
    },

    set_ixy(e){
      let [ix, iy] = this.get_ixy(e)
      this.ix0 = this.ix1 = ix
      this.iy0 = this.iy1 = iy
      this.sel.x = this.isx*this.stw
      this.sel.y = this.isy*this.sth
    },

    upd_cursor(){
      switch (this.prev_canvas){
        case canvas.tileset:
          this.app_tileset.stage.removeChild(this.sel)
          break
        case canvas.anims:
          this.app_anims.stage.removeChild(this.sel)
          break
        case canvas.terra:
          this.app_terra.stage.removeChild(this.sel)
          break
      }
      
      this.sel.clear()
      draw_box(this.sel, this.sw*this.stw, this.sh*this.sth)
      this.sel.x = this.stw*this.isx
      this.sel.y = this.sth*this.isy

      switch (this.curr_canvas){
        case canvas.tileset:
          this.app_tileset.stage.addChild(this.sel)
          break
        case canvas.anims:
          this.app_anims.stage.addChild(this.sel)
          break
        case canvas.terra:
          this.app_terra.stage.addChild(this.sel)
          break
      }
    },
  }, // methods

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

    // which canvas the cursor should be drawn on
    this.curr_canvas = canvas.tileset
    this.prev_canvas = canvas.tileset
    this.sel_type = canvas.tileset
  }, // created

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

    // create cursor
    this.sel = new PIXI.Graphics()
    draw_box(this.sel, this.stw, this.sth)
    this.app_tileset.stage.addChild(this.sel)
  }, // mounted
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
