<template lang='pug'>
#editor_tileset
  ui-splitter#splitter(
    min2='400px'
    max2='500px'
    mode='B'
  )
    ed-tileset-image(
      slot='slot1'
      :iflag='iflag'
      :itab='itab'
      :iterra='iterra'
      :tile_sec='tile_sec'
      @set_curr_tile='set_curr_tile'
      @set_ntiles='set_ntiles'
    )
    ed-tileset-sidebar(
      slot='slot2'
      :curr_tile='curr_tile'
      :iflag='iflag'
      :itab='itab'
      :iterra='iterra'
      :ntiles='ntiles'
      :tile_sec='tile_sec'
      @set_iflag='set_iflag'
      @set_iterra='set_iterra'
      @set_tile_sec='set_tile_sec'
    )
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'
import ed_tileset_image from './ed_tileset_image.vue'
import ed_tileset_sidebar from './ed_tileset_sidebar.vue'

// use bus to communicate between tileset image and sidebar
import Vue from 'vue'
export const bus = new Vue()
import { tile_mode } from '../const.js'

export default
{
  name: 'editor_tileset',

  data(){
    return {
      curr_tile: 0, // tile-index, row-major
      iflag: null,
      iterra: null,
      ntiles: null, // set in ed-tileset-image
      tile_sec: tile_mode.props,
    }
  },

  computed: {
    ...mapState([
      'tabs',
    ])
  },

  props: {
    itab: {},
  },

  components: {
    'ed-tileset-image': ed_tileset_image,
    'ed-tileset-sidebar': ed_tileset_sidebar,
  },

  methods: {
    set_curr_tile(i){
      this.curr_tile = i
    },
    set_iflag(i){
      this.iflag = i
    },
    set_iterra(i){
      this.iterra = i
    },
    set_ntiles(n){
      this.ntiles = n
    },
    set_tile_sec(i){
      this.tile_sec = i
    }
  },

  created(){
    this.iflag = (this.tabs[this.itab].data.tile_flags.length == 0) ? null : 0
  },
}
</script>

<style scoped lang='sass'>
@import ../theme

#editor_tileset, #image-area, #bar-area
  width: 100%
  height: 100%
</style>
