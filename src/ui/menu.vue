<template lang='pug'>
#menu.menu(
  :class='{ is_root }'
  )
  .dmenu
    li(v-for='(item,i) in items' :key='i')
      .item.flex-row(@click='item_clicked(i)')
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
        @clicked='on_click($event, i)'
      )
</template>

<script>
export default {
  name: 'ui-menu',

  props: {
    items: {},
    is_root: { default: true },
  },

  methods:
  {
    item_clicked(i){
      this.$emit('clicked', [i])
    },

    on_click(arr, i){
      arr.unshift(i)
      this.$emit('clicked', arr)
    },
  },
}
</script>

<style scoped lang='sass'>
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
  visibility: hidden
li:hover > .menu
  visibility: visible

#menu:not(.is_root)
  position: absolute
  left: 100%
  top: -5px // should be matched to (border + padding)
  bottom: initial // needed to make the menu the "default" size
  // bottom: -5px
  // top: initial
  padding: 4px 0px 4px 0px

</style>
