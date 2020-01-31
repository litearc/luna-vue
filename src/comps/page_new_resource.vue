<template lang='pug'>
#el.flex-col
  .flex-row
    span Type
    ui-combobox(
      :items='["Sprite", "Animation", "Tileset", "Map"]'
      mstyle='width: 150px'
      @item_selected='on_page_select'
    )

  new-sprite(v-if='ipage == 0')
  new-anim(v-if='ipage == 1')
  new-tileset(v-if='ipage == 2')
  new-map(v-if='ipage == 3')

  .flex-row(style='margin-top: 16px')
    .expand
    button(
      @click='$emit("cancelled")'
    ) Cancel
    button.highlighted(
      @click='$emit("create_editor")'
    ) Create
</template>

<script>
import new_anim from './new_anim.vue'
import new_map from './new_map.vue'
import new_sprite from './new_sprite.vue'
import new_tileset from './new_tileset.vue'

export default
{
  name: 'page_new_resource',

  data(){
    return {
      ipage: 0,
    }
  },

  components: {
    'new-anim': new_anim,
    'new-map': new_map,
    'new-sprite': new_sprite,
    'new-tileset': new_tileset,
  },

  methods:
  {
    on_page_select(i){
      this.ipage = i
    },
  }, // methods

}
</script>

<style lang='sass'>
@import ../theme

button
  min-width: $button-std-w
</style>
