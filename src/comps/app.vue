<template lang='pug'>
#app.center
  #icon-menu
    div.menu-item(@click='on_new_file')
      span.item-icon
        faicon(icon='file')
      span New File
    div.menu-item(@click='on_new_proj')
      span.item-icon
        faicon(icon='folder')
      span New Project
    div.menu-item(@click='on_open')
      span.item-icon
        faicon(icon='folder-open')
      span Open File / Project
  ui-checkbox(
    :items='["hello", "world"]'
  )
</template>

<script>
export default {
  name: 'app',

  methods: {
    on_new_file(){},
    on_new_proj(){},
    on_open(){},
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

#icon-menu .item-icon
  display: inline-block
  text-align: center
  width: 24px

.menu-item:hover
  color: $c-bright

</style>
