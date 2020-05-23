<template lang='pug'>
#editor_tileset
  ui-splitter#splitter(
    min2='400px'
    max2='500px'
    mode='B'
  )
    ed-tileset-image(
      slot='slot1'
      :ianim='ianim'
      :iflag='iflag'
      :itab='itab'
      :iterra='iterra'
      :tile_sec='tile_sec'
      @set_itile='itile = arguments[0]'
    )
    ed-tileset-sidebar(
      slot='slot2'
      :ianim='ianim'
      :iflag='iflag'
      :itab='itab'
      :iterra='iterra'
      :itile='itile'
      :ntiles='ntiles'
      :tile_sec='tile_sec'
      @set_tile_sec='tile_sec = arguments[0]'
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
      ianim: null,
      iflag: null,
      iterra: null,
      itile: 0, // tile-index, row-major
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

  created(){
    this.iflag = (this.tabs[this.itab].data.tile_flags.length == 0) ? null : 0
    bus.$on('set_ianim', (i) => { this.ianim = i })
    bus.$on('set_iflag', (i) => { this.iflag = i })
    bus.$on('set_iterra', (i) => { this.iterra = i })
    bus.$on('set_ntiles', (i) => { this.ntiles = i })
    bus.$on('set_tile_sec', (i) => { this.tile_sec = i })
  },
}
</script>

<style scoped lang='sass'>
@import ../theme

#editor_tileset
  width: 100%
  height: 100%
</style>
