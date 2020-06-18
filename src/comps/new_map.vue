<template lang='pug'>
#new_map
  .flex-row.align-bl.spaced-8px
    span Tileset
    ui-input(
      placeholder='file not chosen'
      :value='fname'
      disabled
      mclass='expand'
    )
    faicon.icon.hover-hl(
      icon='folder-open'
      @click='on_file_select'
    )
  .grid.hgap-20px(style='grid-template-columns: 1fr 1fr; margin-top: 8px')
    .g11
      .flex-row.align-bl.spaced-8px
        span Width
        .expand
        ui-input(
          type='number'
          placeholder='-'
          :value='map_width_text'
          mstyle='width: 60px; text-align: right'
        )
        span tiles
    .g12
      .flex-row.align-bl.spaced-8px
        span Height
        .expand
        ui-input(
          type='number'
          placeholder='-'
          :value='map_height_text'
          mstyle='width: 60px; text-align: right'
        )
        span tiles
</template>

<script>
import { load_tileset_file } from './page_intro.vue'
import { map_mode } from '../const.js'
let fs = require('fs')
let path = require('path')
let { dialog } = require('electron').remote

export default
{
  name: 'new_map',

  data(){
    return {
      fpath: '',
      fname: '',
      map_width: 20,
      map_height: 15,
    }
  },

  computed:
  {
    map_width_text(){
      if (this.map_width === null) return ''
      return this.map_width
    },
    map_height_text(){
      if (this.map_height === null) return ''
      return this.map_height
    },
  },

  methods: {
    editor_data(){
      return {
        file: null, // JSON file opened (if opened)
        fpath: this.fpath, // image file (e.g. .png) opened
        map_w : this.map_width,
        map_h : this.map_height,
        ts: this.ts,
        edit_mode: map_mode.point,
      }
    },
    on_file_select(){
      dialog.showOpenDialog({
        filters: [{
          name: 'Tileset',
          extensions: ['json'],
        }],
        properties: ['openFile'],
      }).then( async ({canceled, filePaths}) => {
        if (!canceled){
          this.fpath = filePaths[0]
          this.fname = path.basename(this.fpath)
          this.ts = await load_tileset_file(this.fpath) // tileset data
        }
      })
    }
  }
}
</script>
