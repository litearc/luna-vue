<template lang='pug'>
#page_intro
  ui-icon-text(
    icon='file'
    text='New File'
    hl='text'
    @click='$emit("new_file_selected")'
  )
  ui-icon-text(
    icon='folder'
    text='New Project'
    hl='text'
    @click='$emit("new_proj_selected")'
  )
  ui-icon-text(
    icon='folder-open'
    text='Open File / Project'
    hl='text'
    @click='on_open'
  )
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'
import * as PIXI from 'pixi.js'
let fs = require('fs')
let path = require('path')
let { dialog } = require('electron').remote
import { load_image } from '../js/image'
import { i8_to_f32 } from '../js/util'

async function load_tileset_file(fp){
  let o = JSON.parse(fs.readFileSync(fp, 'utf8'))
  // im_data is not stored in the json file, so load it from image
  let {w, h, data} = await load_image(o.fpath)
  o.im_data = i8_to_f32(data)
  return o
}

export default
{
  name: 'page-intro',

  computed: {
    ...mapState([
      'tabs',
    ]),
  },

  methods: {
    ...mapMutations([
      'push',
    ]),

    on_open(){
      // open file / folder select dialog, and return path
      dialog.showOpenDialog({
      }).then( async ({canceled, filePaths}) => {
        if (!canceled){
          let o = await load_tileset_file(filePaths[0])
          this.push([this.tabs, { name: 'Untitled', type: 'tileset', data: o }])
          this.$emit('open_tab')
        }
      })
    },
  },
}
</script>
