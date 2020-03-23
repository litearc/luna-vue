<template lang='pug'>
#el_tileset_image.center(ref='root')
  img(src='../images/roadway.png')
</template>

<script>
import * as PIXI from 'pixi.js'
// let fs = require('fs')
// let m = fs.readFileSync('/home/hislam/s/code/vue/app/src/comps/roadway.png')
// console.log(m)

export default
{
  name: 'ed_tileset_image',

  data(){
    return {
      pub: process.env.BASE_URL
    }
  },

  props: {
    itab: {},
  },

  mounted(){
    console.log(this.pub)
    let tex = PIXI.Texture.from(`${this.pub}hummingbird.png`)
    console.log(tex)
  },
}
</script>

<style scoped lang='sass'>
@import ../theme
</style>

