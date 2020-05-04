<template lang='pug'>
  span {{ ed_data }}
</template>

<script>
import editor_anim from './editor_anim.vue'
import editor_map from './editor_map.vue'
import editor_sprite from './editor_sprite.vue'
import editor_tileset from './editor_tileset.vue'

export default
{
  name: 'editor',

  data(){
    return {
      editors: {
        'anim': editor_anim,
        'map': editor_map,
        'sprite': editor_sprite,
        'tileset': editor_tileset,
      },
    }
  },

  props: {
    ed_data: { default: 'hello' },
  },

}
</script>
