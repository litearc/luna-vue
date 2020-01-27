<template lang='pug'>
#app.center
  #icon-menu(v-if='show == "start_menu"')
    ui-icon-text(
      icon='file'
      text='New File'
      hl='text'
      @click='on_new_file'
    )
    ui-icon-text(
      icon='folder'
      text='New Project'
      hl='text'
      @click='on_new_proj'
    )
    ui-icon-text(
      icon='folder-open'
      text='Open File / Project'
      hl='text'
      @click='on_open'
    )

  #new-file-menu.flex-col(v-if='show == "new_file_menu"' style='width: 300px; border: 1px solid #444')
    .flex-row
      span Type
      ui-combobox(
        :items='["Sprite", "Animation", "Tileset", "Map"]'
        mstyle='width: 150px'
      )
    .flex-row
      span File
      ui-input(
        placeholder='file not chosen'
        :value='fname'
        disabled
        mclass='expand'
      )
      faicon.icon.clickable(
        icon='folder-open'
        @click='on_file_select'
      )
    div
      span.bold Image
      div Width: 320px
      div Height: 240px
      
</template>

<script>
let path = require('path')
let { dialog } = require('electron').remote

export default {
  name: 'app',

  data(){
    return {
      show: 'start_menu',
      fpath: '',
      fname: '',
    }
  },

  methods:
  {
    on_new_file(){
      this.show = 'new_file_menu'
    },

    on_new_proj(){
    },

    on_open(){
    },

    back_to_start(){
      this.show = 'start_menu'
    },

    on_file_select(){
      dialog.showOpenDialog({
        filters: [{
          name: 'Image Files',
          extensions: ['png', 'bmp', 'jpg'],
        }],
        properties: ['openFile'],
      }).then(({canceled, filePaths}) => {
        if (!canceled){
          this.fpath = filePaths[0]
          this.fname = path.basename(this.fpath)
        }
      })
    },
  },
}
</script>

<style lang='sass'>
@import ../theme
*
  box-sizing: border-box
  user-select: none

#app
  width: 100vw
  height: 100vh
  background-color: #222

  // for some reason, `position: relative` (along with `overflow: hidden`) is
  // needed to prevent the tooltip from expanding the div
  position: relative // allows absolute position of subelements
  overflow: hidden

  @include global

.item-icon
  display: inline-block
  text-align: center
  width: 24px

.menu-item:hover
  color: $c-bright

</style>
