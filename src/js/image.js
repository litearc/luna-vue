let fs = require('fs'),
    path = require('path'),
    png = require('png-js')

// loads an image file at path `fp` and returns an object
// { data: Buffer, w: Number, h: Number }
export function load_image(fp){
  let w, h, pixels
  switch (path.extname(fp))
  {
    case '.png':
      let buf = fs.readFileSync(fp)
      let data = new png(buf)
      w = data.width
      h = data.height
      data.decode((vals) => {
        pixels = vals
      })
      break
  }
  return { w, h, data: pixels }
}

