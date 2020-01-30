<template lang='pug'>
#el
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
  .grid.hgap(style='grid-template-columns: 1fr 1fr')
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
    .g12.bold Sprite
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

export default
{
  name: 'new_sprite',

  data(){
    return {
      fpath: '',
      fname: '',
      imwidth: null,
      imheight: null,
      img: null,
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
  }, // methods
}
</script>

<style lang='sass'>
</style>

