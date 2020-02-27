<template lang='pug'>
#el.flex-col
  #tab-area.flex-row
    ui-tabs.expand(
      :tabs='tabs'
      :itab='itab'
      @tab_changed='on_tab_changed'
      @tab_closed='on_tab_closed'
    )
    #icon-area
      .vcenter
        faicon.icon.clickable(
          icon='file'
          @click='on_new_file'
        )
        faicon.icon.clickable(
          icon='folder-open'
          @click='on_open_file'
        )

  #content.expand.center
    keep-alive
      component(
        :is='tab_comp[itab]'
        v-if='curr_editor.type === "none"'
        @create_page='on_create_page'
        style='width: 320px; height: 240px'
      )
      component(
        :is='tab_comp[itab]'
        v-else
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

let _ = require('lodash')

export default
{
  name: 'tabs',

  data(){
    return {
      itab: 0, // index of currently active tab

      // an array that stores, for each tab, a component options object for the
      // current editor (or new resource page). these objects are cloned from
      // the base objects from the 'import' statements above - otherwise the
      // data is shared across tabs.
      // `tab_comp[0]` is the editor for the 0-th tab.
      tab_comp: ()=>[],

      // maps string for editor type to component options object
      editor: {
        'none': page_new_resource,
        'anim': editor_anim,
        'map': editor_map,
        'sprite': editor_sprite,
        'tileset': editor_tileset,
      },
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

  methods:
  {
    ...mapMutations([
      'push',
      'set_prop',
    ]),

    on_create_page(page_name, ed_data){
      this.set_prop([this.tab_comp, this.itab,
        _.cloneDeep(this.editor[page_name])])
      this.set_prop([this.tabs, this.itab, {
        name: 'Untitled',
        type: page_name,
        data: ed_data,
      }])
    },

    on_new_file(){
      this.push([this.tabs, {
        name: 'Untitled',
        type: 'none',
        data: {},
      }])
      let i = this.tabs.length-1
      this.set_prop([this.tab_comp, i, _.cloneDeep(page_new_resource)])
    },

    on_open_file(){
    },

    on_tab_changed(i){
      this.itab = i
    },

    on_tab_closed(i){
    }
  }, // methods

  created(){
    this.set_prop([this.tab_comp, 0, _.cloneDeep(page_new_resource)])
  },

  mounted(){
  },
}
</script>

<style scoped lang='sass'>
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

#icon-area
  height: 100%
  padding-left: 6px
  padding-right: 6px

  & .icon:not(:first-child)
    margin-left: 8px
</style>

