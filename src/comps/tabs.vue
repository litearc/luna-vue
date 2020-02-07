<template lang='pug'>
#el.flex-col
  #tab-area.flex-row
    #tabs.expand
    #actions
  #content.expand(
    style='border: 1px solid red'
    @click='on_click'
  )
    keep-alive
      editor-anim(v-if='curr_editor.type === "anim"')
      editor-map(v-if='curr_editor.type === "map"')
      editor-sprite(v-if='curr_editor.type === "sprite"')
      editor-tileset(v-if='curr_editor.type === "tileset"')
</template>

<script>
import Vue from 'vue'
import editor_anim from './editor_anim.vue'
import editor_map from './editor_map.vue'
import editor_sprite from './editor_sprite.vue'
import editor_tileset from './editor_tileset.vue'

export default
{
  name: 'tabs',

  data(){
    return {
      itab: 0, // index of currently active tab
      editors: [
        { type: 'map' },
        { type: 'anim' },
        { type: 'sprite' },
      ],
    }
  },

  props: {
    // if the value of a given index in the tab array is `null`, display the
    // "new resource" page to load appropriate data
    tab_data: { default: ()=>[ null ] },
  },

  computed: {
    curr_editor(){
      return this.editors[this.itab]
    },
    ntabs(){
      return this.editors.length
    }
  },

  components: {
    'editor-anim': editor_anim,
    'editor-map': editor_map,
    'editor-sprite': editor_sprite,
    'editor-tileset': editor_tileset,
  },

  methods: {
    on_click(){
      this.itab = (this.itab+1)%this.ntabs
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

