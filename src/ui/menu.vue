<template lang='pug'>
#menu.menu(:class='{ is_root }')
  .dmenu
    li(v-for='(item,i) in items' :key='i')
      .item.flex-row
        span {{ item.name }}
        .expand
        faicon.icon(
          v-if='item.contents !== null'
          icon='caret-right'
        )
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

ul, li
  padding: 0
  margin: 0

.dmenu
  list-style: none
  position: relative
  display: none

#menu.is_root > .dmenu
  display: block

li
  position: relative // needed to position .dsubmenu correctly
  padding-left: 12px
  padding-right: 12px

li:hover > .item
  color: $c-bright

li:hover > .dmenu, li:hover > #menu > .dmenu
  display: block

li > .menu
  border: 0
li:hover > .menu
  border: 1px solid $c-border

#menu:not(.is_root)
  position: absolute
  left: 100%
  top: -1px // should be matched to border width
  padding: 0

</style>