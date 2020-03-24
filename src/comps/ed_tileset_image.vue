<template lang='pug'>
#el_tileset_image.center(ref='root')
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'
import * as PIXI from 'pixi.js'
let app

export default
{
  name: 'ed_tileset_image',

  data(){
    return {
      pub: process.env.BASE_URL
    }
  },

  computed: {
    ...mapState([
      'tabs',
    ])
  },

  props: {
    itab: {},
  },

  mounted(){
    // let tex = PIXI.Texture.from(`${this.pub}hummingbird.png`)
    let { im_data, im_width, im_height } = this.tabs[this.itab].data
    app = new PIXI.Application({width: im_width, height: im_height})
    this.$refs.root.appendChild(app.view)
    let tex = PIXI.Texture.fromBuffer(im_data, im_width, im_height)
    let spr = new PIXI.Sprite(tex)
    app.stage.addChild(spr)
  },
}
</script>

<style scoped lang='sass'>
@import ../theme
</style>

