<template lang='pug'>
#app.center.border-red-100

  page-intro(
    v-if='page == "intro"'
    @new_file_selected='page = "tabs"'
  )

  tabs(
    v-if='page == "tabs"'
    @all_tabs_closed='page = "intro"'
  )
  
</template>

<script>
import page_intro from './page_intro.vue'
import tabs from './tabs.vue'

export default {
  name: 'app',

  data(){
    return {
      page: 'intro', // 'intro', 'tabs'
    }
  },

  components:
  {
    'page-intro': page_intro,
    'tabs': tabs,
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
</style>
