// this is the entry point for the application, which shows the "intro" page or,
// once a file is created or opened, one of the editors.

<template lang='pug'>
#app.center
  // show the intro page containing, e.g. "New File", "Open File", ...
  page-intro(
    v-if='page == "intro"'
    @new_file_selected='page = "tabs"'
    @open_tab='page = "tabs"'
  )

  // show the tabs widgets, which handles everything else, and contains the
  // various resource editors (you can also create/open resources from here).
  tabs(
    v-if='page == "tabs"'
    @all_tabs_closed='page = "intro"'
    @cancelled='page = "intro"'
  )
</template>

<script>
import page_intro from './page_intro.vue'
import tabs from './tabs.vue'

// this is a global object imported by various components. the reason we use
// this instead of passing props is that Vue by default makes data reactive,
// which *significantly* impacts performance with large data objects, e.g.
// image textures, which we cache and use across components.
export const o = {
  // tabs[i] stored data for tab `i`
  tabs: [],
}

export default {
  name: 'app',

  data(){
    return {
      page: 'intro', // which page to show: 'intro', 'tabs'
    }
  }, // data

  components: {
    'page-intro': page_intro,
    'tabs': tabs,
  }, // components
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

  @include font
</style>
