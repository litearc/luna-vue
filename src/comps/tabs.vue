<template lang='pug'>
#tabs.full.flex-col
  #tab-area.flex-row
    ui-tabs.expand(
      :tabs='tabs'
      :itab='itab'
      @tab_changed='on_tab_changed'
      @tab_closed='on_tab_closed'
    )
    #icon-area.full-h.px-8px
      .vcenter.hspaced-8px
        faicon.hover-hl(
          icon='file'
          @click='on_new_file'
        )
        faicon.hover-hl(
          icon='folder-open'
          @click='on_open_file'
        )

  #content.expand.center
    keep-alive
      component(
        v-if='curr_editor.type === "none"'
        :is='tab_comp[itab]'
        @create_page='on_create_page'
        style='width: 320px; height: 240px'
      )
      component(
        v-else
        :is='tab_comp[itab]'
        :itab='itab'
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
      tab_comp: [],

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
      'remove',
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
      if (i <= this.itab)
        this.itab = Math.max(this.itab-1, 0)

      this.remove([this.tabs, i])
      this.remove([this.tab_comp, i])
      if (this.tabs.length == 0)
        this.$emit('all_tabs_closed')
    }
  }, // methods

  created(){
    this.push([this.tabs, { name: 'Untitled', type: 'none', data: {} }])
    this.push([this.tab_comp, _.cloneDeep(page_new_resource)])
  },

  mounted(){
  },
}
</script>

<style scoped lang='sass'>
@import ../theme

#tab-area
  height: 24px
  background-color: $cB
</style>

