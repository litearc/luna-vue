<template lang='pug'>
.ui-tree(:style='ui_style')
  // first list folders ...
  #root
    faicon.icon.hover-hl(
      :icon='folder_icon'
      @click='on_icon_click'
      style='width: 12px; margin-right: 8px'
    )
    span {{ root.name }}
  // ... then files
  #contents(v-if='root.is_folder && root.is_open')
    #folder(v-for='f in folders')
      ui-tree(
        :root='f'
        :indent='indent + 20'
      )
    #file(v-for='f in files') {{ f.name }}
</template>

<script>

import { mapMutations } from 'vuex'

export default {
  name: 'ui-tree',

  props: {
    root: {},
    indent: { default: 0 },
  },

  computed:
  {
    files(){
      return this.root.contents.filter(f => !f.is_folder)
    },

    folders(){
      return this.root.contents.filter(f => f.is_folder)
    },

    folder_icon(){
      return (this.root.is_open) ? 'folder-open' : 'folder'
    },

    ui_style(){
      let style = {}
      style['margin-left'] = `${this.indent}px`
      return style
    }
  }, //computed

  methods:
  {
    ...mapMutations([
      'toggle',
    ]),

    on_icon_click(){
      this.root.is_open = !this.root.is_open
    },
  }, // methods
}
</script>

<style scoped lang='sass'>
#file
  margin-left: 20px
</style>
