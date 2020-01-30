<template lang='pug'>
#app.center

  page-intro(
    v-if='page == "intro"'
    @new_file_selected='page = "new_resource"'
  )

  page-new-resource(
    v-if='page == "new_resource"'
    @cancelled='page = "intro"'
  )
  
</template>

<script>
import page_intro from './page_intro.vue'
import page_new_resource from './page_new_resource.vue'

export default {
  name: 'app',

  data(){
    return {
      page: 'intro', // 'intro', 'new_resource', or 'editors'
    }
  },

  components:
  {
    'page-intro': page_intro,
    'page-new-resource': page_new_resource,
  },
}
</script>

<style lang='sass'>
@import ../theme
*
  box-sizing: border-box
  user-select: none

#app
  width: 100vw
  height: 100vh
  background-color: #222

  // for some reason, `position: relative` (along with `overflow: hidden`) is
  // needed to prevent the tooltip from expanding the div
  position: relative // allows absolute position of subelements
  overflow: hidden

  @include global

.item-icon
  display: inline-block
  text-align: center
  width: 24px

.menu-item:hover
  color: $c-bright

</style>
