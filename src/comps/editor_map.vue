<template lang='pug'>
  ui-splitter#splitter(
    min2='400px'
    max2='520px'
    mode='B'
  )
    ed-map-image(
      slot='slot1'
      :o='o'
    )
    ed-map-sidebar(
      slot='slot2'
      :o='o'
    )
</template>

<script>
import ed_map_image from './ed_map_image.vue'
import ed_map_sidebar from './ed_map_sidebar.vue'
import Vue from 'vue'
export const bus = new Vue()

import { o } from './app.vue'
import { mapState, mapGetters, mapMutations } from 'vuex'
import * as PIXI from 'pixi.js'
import { set_g_tiles, set_g_anim_tiles } from './tabs.vue'

export default
{
  name: 'editor_map',

  props: {
    o: {},
  },

  computed: {
    ...mapState([
      'itab',
    ]),
  },

  components: {
    'ed-map-image': ed_map_image,
    'ed-map-sidebar': ed_map_sidebar,
  },

  created(){
    let imw = this.o.ts.im_w
    let imh = this.o.ts.im_h
    let tw = this.o.ts.tile_w
    let th = this.o.ts.tile_h
    let tnx = Math.round(imw/tw)
    let tny = Math.round(imh/th)

    o.tabs[this.itab].base_tex = PIXI.BaseTexture.fromBuffer(this.o.ts.im_data, imw, imh)
    set_g_tiles(this.itab, o.tabs[this.itab].base_tex, tnx, tny, tw, th)
    set_g_anim_tiles(this.itab, this.o.ts.anims, tw)
  },
}
</script>
