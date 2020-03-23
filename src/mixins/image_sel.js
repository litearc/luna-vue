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
      im_width: null,
      im_height: null,
      im_data: null,
    }
  },

  computed:
  {
    im_width_text(){
      if (this.imwidth === null) return ''
      return this.im_width
    },
    im_height_text(){
      if (this.imheight === null) return ''
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
          this.im_data = data
          console.log(data)
        }
      })
    },
  }, // methods
}

