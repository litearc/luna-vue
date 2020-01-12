<template lang='pug'>
#menu
  ui.dmenu
    li 1a
    li 1b
    li 1c
      ul.dmenu
        li 2a_more_words
          ul.dmenu
            li 3a
            li 3b
            li 3c
        li 2b
</template>

<script>
export default {
  name: 'ui-menu',

}
</script>

<style lang='sass'>
@import ../theme

li
  border: 1px solid green
  //height: 28px

ul, li
  padding: 0
  margin: 0

.dmenu
  list-style: none
  position: relative
  display: none

#menu > .dmenu
  display: block

li
  position: relative // needed to position .dsubmenu correctly

li:hover > ul.dmenu
  display: block

ul.dmenu
  position: absolute
  left: 100%
  top: -1px
  padding: 0

</style>