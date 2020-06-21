<template lang='pug'>
  ui-splitter#splitter(
    min2='400px'
    max2='520px'
    mode='B'
  )
    ed-map-image(
      slot='slot1'
      :o='o'
    )
    ed-map-sidebar(
      slot='slot2'
      :o='o'
    )
</template>

<script>
import ed_map_image from './ed_map_image.vue'
import ed_map_sidebar from './ed_map_sidebar.vue'
import Vue from 'vue'
export const bus = new Vue()

export default
{
  name: 'editor_map',

  props: {
    o: {},
  },

  components: {
    'ed-map-image': ed_map_image,
    'ed-map-sidebar': ed_map_sidebar,
  },
}
</script>
