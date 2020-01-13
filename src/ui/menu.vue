<template lang='pug'>
#menu(:class='{ is_root }')
  //- .dmenu
  //-   li 1a
  //-   li 1b
  //-   li 1c
  //-     ul.dmenu
  //-       li 2a_more_words
  //-         ul.dmenu
  //-           li 3a
  //-           li 3b
  //-           li 3c
  //-       li 2b
  
  .dmenu
    li(v-for='(item,i) in items' :key='i')
      span {{ item.name }}
      ui-menu(
        v-if='item.contents !== null'
        :items='item.contents'
        :is_root='false'
      )
</template>

<script>
export default {
  name: 'ui-menu',

  props: {
    items: {},
    is_root: { default: true },
  }
}
</script>

<style lang='sass'>
@import ../theme

li
  border: 1px solid green

ul, li
  padding: 0
  margin: 0

.dmenu
  list-style: none
  position: relative
  display: none

#menu.is_root > .dmenu
  display: block

// #menu:not(.is_root)
//   border: 1px solid red

li
  position: relative // needed to position .dsubmenu correctly

li:hover > .dmenu
  display: block

li:hover > #menu > .dmenu
  display: block

// ul.dmenu
//   position: absolute
//   left: 100%
//   top: -1px
//   padding: 0

#menu:not(.is_root)
  position: absolute
  left: 100%
  top: -1px
  padding: 0

</style>