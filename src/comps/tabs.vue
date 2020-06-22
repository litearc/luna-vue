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
        faicon.icon.hover-hl(
          icon='file'
          @click='on_new_file'
        )
        faicon.icon.hover-hl(
          icon='folder-open'
          @click='on_open_file'
        )

  #content.expand.center
    keep-alive
      component(
        v-if='curr_editor.type === "none"'
        :is='tab_comp[itab]'
        @create_page='on_create_page'
        @cancelled='on_tab_closed'
        style='width: 320px; height: 240px'
      )
      component(
        v-else
        :is='tab_comp[itab]'
        :o='tabs[itab].data'
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
import { load_tileset_file } from './page_intro.vue'
import * as PIXI from 'pixi.js'

let { dialog } = require('electron').remote
let _ = require('lodash')
import { o } from './app.vue'

export function set_g_tiles(itab, base, nx, ny, tw, th){
  o.tabs[itab].g_tiles = [] // so it can be shared
  let i = 0
  for (let yi = 0; yi < ny; yi++)
    for (let xi = 0; xi < nx; xi++)
      o.tabs[itab].g_tiles[i++] = new PIXI.Texture(base,
        new PIXI.Rectangle(xi*tw, yi*th, tw, th))
}

export function set_g_anim_tiles(itab, anims, tw){
  o.tabs[itab].g_anim_tiles = []
  for (let ia = 0; ia < anims.length; ia++){
    o.tabs[itab].g_anim_tiles[ia] = []
    for (let it = 0; it < anims[ia].tiles.length; it++){
      let i = anims[ia].tiles[it]
      let spr = new PIXI.Sprite(o.tabs[itab].g_tiles[i])
      spr.x = it*tw, spr.y = 0
      o.tabs[itab].g_anim_tiles[ia].splice(it, 0, spr)
      // this.insert([o.tabs[itab].g_anim_tiles[ia], it, spr])
    }
  }
}

export default
{
  name: 'tabs',

  data(){
    return {
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
  },

  computed: {
    ...mapState([
      'itab',
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
      'set',
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
      o.tabs[this.itab] = {}
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
      dialog.showOpenDialog({
      }).then( async ({canceled, filePaths}) => {
        if (!canceled){
          let d = await load_tileset_file(filePaths[0])
          this.push([this.tabs, { name: 'Untitled', type: d.type, data: d }])
          this.push([this.tab_comp, _.cloneDeep(this.editor[this.tabs[this.itab].type])])
          o.tabs.push({})
        }
      })
    },

    on_tab_changed(i){
      this.set(['itab', i])
    },

    on_tab_closed(i){
      if (i === undefined)
        i = this.itab
      if (i <= this.itab)
        this.set(['itab', Math.max(this.itab-1, 0)])

      this.remove([this.tabs, i])
      this.remove([this.tab_comp, i])
      if (this.tabs.length == 0)
        this.$emit('all_tabs_closed')
    }
  }, // methods

  created(){
    if (this.itab > this.tabs.length-1){
      // user clicked "new file"
      this.push([this.tabs, { name: 'Untitled', type: 'none', data: {} }])
      this.push([this.tab_comp, _.cloneDeep(page_new_resource)])
      o.tabs.push({})
    }
    else {
      // user opened a file
      this.push([this.tab_comp, _.cloneDeep(this.editor[this.tabs[this.itab].type])])
      o.tabs.push({})
    }
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
