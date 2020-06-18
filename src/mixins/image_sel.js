let fs = require('fs')
let path = require('path')
let { dialog } = require('electron').remote
import { load_image } from '../js/image'
import { i8_to_f32 } from '../js/util'

export default
{
  data(){
    return {
      fpath: '',
      fname: '',
      im_width: null,
      im_height: null,
      im_data: null,
    }
  },

  computed:
  {
    im_width_text(){
      if (this.im_width === null) return ''
      return this.im_width
    },
    im_height_text(){
      if (this.im_height === null) return ''
      return this.im_height
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
      }).then( async ({canceled, filePaths}) => {
        if (!canceled){
          this.fpath = filePaths[0]
          this.fname = path.basename(this.fpath)
          let {w, h, data} = await load_image(this.fpath)
          this.im_width = w
          this.im_height = h
          this.im_data = i8_to_f32(data)
        }
      })
    },
  }, // methods
}

