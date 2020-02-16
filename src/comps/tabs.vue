<template lang='pug'>
#el.flex-col
  #tab-area.flex-row
    #tabs.expand
    #actions

  #content.center(
    style='border: 1px solid red'
    @click='on_click'
  )
    keep-alive
      page-new-resource(
        v-if='curr_editor.type === "none"'
        style='border: 1px solid green; width: 320px; height: 200px'
        @create_page='on_create_page'
      )
      editor-anim(
        v-if='curr_editor.type === "anim"'
      )
      editor-map(
        v-if='curr_editor.type === "map"'
      )
      editor-sprite(
        v-if='curr_editor.type === "sprite"'
      )
      editor-tileset(
        v-if='curr_editor.type === "tileset"'
      )
</template>

<script>
import Vue from 'vue'
import editor_anim from './editor_anim.vue'
import editor_map from './editor_map.vue'
import editor_sprite from './editor_sprite.vue'
import editor_tileset from './editor_tileset.vue'
import page_new_resource from './page_new_resource.vue'
import { mapState, mapGetters, mapMutations } from 'vuex'

export default
{
  name: 'tabs',

  data(){
    return {
      itab: 0, // index of currently active tab
    }
  },

  props: {
    // if the value of a given index in the tab array is `null`, display the
    // "new resource" page to load appropriate data
    tab_data: { default: ()=>[ null ] },
  },

  computed: {
    ...mapState([
      'tabs',
    ]),
    curr_editor(){
      return this.tabs[this.itab]
    },
    ntabs(){
      return this.tabs.length
    },
  },

  components: {
    'editor-anim': editor_anim,
    'editor-map': editor_map,
    'editor-sprite': editor_sprite,
    'editor-tileset': editor_tileset,
    'page-new-resource': page_new_resource,
  },

  methods: {
    on_click(){
      this.itab = (this.itab+1)%this.ntabs
    },
    on_create_page(page_name, ed_data){
      // TODO: this is not reactive
      this.tabs[this.itab] = {
        type: page_name,
        data: ed_data,
      }
      console.log('page created')
    },
  }, // methods

  created(){
  },

  mounted(){
  },
}
</script>

<style lang='sass'>
@import ../theme

#el
  width: 100%
  height: 100%

#tab-area
  height: 24px
  background-color: $cB

#tabs
  height: 100%

#actions
  width: 120px
  height: 100%
</style>

