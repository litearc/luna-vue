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
    div.grid.hgap(style='grid-template-columns: 1fr 1fr')
      .g11.bold Image
      .g21
        .flex-row
          span Width
          .expand
          ui-input(
            type='number'
            disabled
            placeholder='-'
            :value='imwidth_text'
            mstyle='width: 60px; text-align: right'
          )
          span px
      .g31
        .flex-row
          span Height
          .expand
          ui-input(
            type='number'
            disabled
            placeholder='-'
            :value='imheight_text'
            mstyle='width: 60px; text-align: right'
          )
          span px
      .g12.bold Tile
      .g22
        .flex-row
          span Width
          .expand
          ui-input(
            type='number'
            value='24'
            mstyle='width: 60px; text-align: right'
          )
          span px
      .g32
        .flex-row
          span Height
          .expand
          ui-input(
            type='number'
            value='32'
            mstyle='width: 60px; text-align: right'
          )
          span px
      
</template>

<script>
let fs = require('fs')
let path = require('path')
let { dialog } = require('electron').remote
import { load_image } from '../js/image'

export default {
  name: 'app',

  data(){
    return {
      show: 'start_menu',
      fpath: '',
      fname: '',
      imwidth: null,
      imheight: null,
      img: null
    }
  },

  computed:
  {
    imwidth_text(){
      if (this.imwidth === null) return ''
      return this.imwidth
    },
    imheight_text(){
      if (this.imheight === null) return ''
      return this.imheight
    },
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
          name: 'Image',
          extensions: ['png'], // only support png for now
        }],
        properties: ['openFile'],
      }).then(({canceled, filePaths}) => {
        if (!canceled){
          this.fpath = filePaths[0]
          this.fname = path.basename(this.fpath)
          let { w, h, data } = load_image(this.fpath)
          this.imwidth = w
          this.imheight = h
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
