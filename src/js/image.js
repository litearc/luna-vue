let fs = require('fs'),
    path = require('path'),
    png = require('png-js')

// promise for png-js decode function
function load_png(buf){
  let p = new Promise((resolve, reject) => {
    let w, h, pixels
    let data = new png(buf)
    w = data.width
    h = data.height
    data.decode((vals) => {
      pixels = vals
      resolve({ w, h, data: pixels })
    })
  })
  return p
}

// loads an image file at path `fp` and returns an object
// { data: Buffer, w: Number, h: Number }
export function load_image(fp){
  switch (path.extname(fp))
  {
    case '.png':
      let buf = fs.readFileSync(fp)
      return load_png(buf)
  }
}

