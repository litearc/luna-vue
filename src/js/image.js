import * as PIXI from 'pixi.js'

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

// creates a PIXI graphics object (or uses an existing one) that contains a
// grid of a certain size and spacing
export function draw_grid(g, w, h, tw, th){
  let ret = (g === undefined)
  let g_ = (ret) ? new PIXI.Graphics() : g
  if (!ret) g.clear()

  let nx = Math.round(w/tw)
    , ny = Math.round(h/th)
  g_.position.set(0, 0)
  g_.lineStyle(1, 0xffffff)
  for (let i = 1; i < nx; i++)
    g_.moveTo(tw*i, 0).lineTo(tw*i, h+1)
  for (let i = 1; i < ny; i++)
    g_.moveTo(0, th*i).lineTo(w+1, th*i)
  g_.alpha = .15

  if (ret) return g_
}

// creates a PIXI graphics object (or uses an existing one) of a rectangular box
// - used as the cursor in grid-like images
export function draw_box(g, w, h){
  let ret = (g === undefined)
  let g_ = (ret) ? new PIXI.Graphics() : g
  if (ret) g.clear()

  g_.clear()
  g_.lineStyle(4, 0x000000)
  g_.beginFill(0xffffff, 0)
  g_.drawRect(0, 0, w, h)
  g_.lineStyle(2, 0x5c99d6)
  g_.beginFill(0xffffff, 0)
  g_.drawRect(0, 0, w, h)
  g_.endFill()

  if (ret) return g_
}
