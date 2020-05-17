<template lang='pug'>
.ui-menu(
  :class='{ "is-root": is_root }'
  )
  .dmenu
    li(v-for='(item,i) in items' :key='i')
      .item.flex-row.align-bl(@click.stop='item_clicked(i)')
        span {{ item.name }}
        .expand
        faicon(
          v-if='item.contents !== null'
          icon='caret-right'
        )
      ui-menu(
        v-if='item.contents !== null'
        :items='item.contents'
        :is_root='false'
        @item-selected='on_item_selected($event, i)'
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
      this.$emit('item-selected', [i])
    },

    on_item_selected(arr, i){
      arr.unshift(i)
      this.$emit('item-selected', arr)
    },
  },
}
</script>

<style scoped lang='sass'>
@import ../theme

$menu-min-width: 120px
.ui-menu
  padding: 4px 0px 4px 0px
  background-color: $cH
  border-radius: 4px
  min-width: $menu-min-width
  border: 1px solid $c-border

  &.is-root
    width: 100%
    overflow-x: hidden

ul, li
  padding: 0
  margin: 0

.dmenu
  list-style: none
  position: relative
  display: none

.ui-menu.is-root > .dmenu
  display: block

li
  position: relative // needed to position .dsubmenu correctly
  padding-left: 12px
  padding-right: 12px

li:hover > .item
  color: $c-text-hl

li:hover > .dmenu, li:hover > .ui-menu > .dmenu
  display: block

li > .ui-menu
  visibility: hidden
li:hover > .ui-menu
  visibility: visible

.ui-menu:not(.is-root)
  position: absolute
  left: 100%
  top: -5px // should be matched to (border + padding)
  bottom: initial // needed to make the menu the "default" size
  // bottom: -5px
  // top: initial
  padding: 4px 0px 4px 0px

</style>
