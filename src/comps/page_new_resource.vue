<template lang='pug'>
#page_new_resource.flex-col.spaced
  .flex-row.bl.spaced
    span Type
    ui-combobox(
      :items='["Sprite", "Animation", "Tileset", "Map"]'
      mstyle='width: 150px'
      @item_selected='on_page_select'
    )

  keep-alive
    component(:is='page' ref='curr_page')

  .flex-row.bl.spaced(style='margin-top: 16px')
    .expand
    button(
      @click='$emit("cancelled")'
    ) Cancel
    button.highlighted(
      @click='on_click_create'
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
      pages: [
        ['sprite', new_sprite],
        ['anim', new_anim],
        ['tileset', new_tileset],
        ['map', new_map],
      ],
    }
  },

  computed: {
    page(){
      return this.pages[this.ipage][1]
    },
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

    on_click_create(){
      let ed_data = this.$refs.curr_page.editor_data()
      this.$emit('create_page', this.pages[this.ipage][0], ed_data)
    },
  }, // methods
}
</script>

<style scoped lang='sass'>
@import ../theme

button
  min-width: $button-std-w
</style>
