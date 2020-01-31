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

