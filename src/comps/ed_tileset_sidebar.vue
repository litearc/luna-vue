<template lang='pug'>
#ed_tileset_sidebar
  .sb-title
    span.bold.center TILESET PROPERTIES
  #grid-tileset
    .grid-head.bold Key
    .grid-head.bold Value
    ui-tooltip(
      text='Add'
      placement='left'
    )
      faicon.icon.clickable.title-icon(
        icon='plus'
        @click='on_tileset_plus'
      )
    template(v-for='(item,i) in tabs[itab].data.tileset_props')
      ui-input(v-model='item.key')
      ui-input(v-model='item.val')
      ui-tooltip(
        text='Remove'
        placement='left'
      )
        faicon.icon.clickable.title-icon(
          icon='minus'
          @click='on_tileset_minus(i)'
          style='margin-left: 2px'
        )
  .divider
  .sb-title
    .inline-block.bold(style='width: 50%; text-align: center') TILE PROPERTIES
    .inline-block.bold(style='width: 50%; text-align: center') TILE FLAGS
  #grid-tile
    template(v-for='(item,i) in tabs[itab].data.tile_props')
      ui-input(v-model='item.key')
      ui-input(v-model='item.val')
      ui-tooltip(
        text='Remove'
        placement='left'
      )
        faicon.icon.clickable.title-icon(
          icon='minus'
          @click='on_tile_minus(i)'
          style='margin-left: 2px'
        )
</template>

<script>
    // span.bold Tile Properties
    // .expand
    // ui-tooltip(
    //   text='Add'
    //   placement='left'
    // )
    //   faicon.icon.clickable.title-icon(
    //     icon='plus'
    //     @click='on_tile_plus'
    //   )
import { mapState, mapGetters, mapMutations } from 'vuex'

export default
{
  name: 'ed_tileset_sidebar',

  data(){
    return {
      h: '15px',
      fill: '#94989a'
    }
  },

  props: {
    itab: {},
  },

  computed: {
    ...mapState([
      'tabs',
    ]),
  },

  methods: {
    ...mapMutations([
      'push',
      'remove',
    ]),
    on_tileset_plus(){
      this.push([this.tabs[this.itab].data.tileset_props, {key:'', val:''}])
    },
    on_tileset_minus(i){
      this.remove([this.tabs[this.itab].data.tileset_props, i])
    },
    on_tile_plus(){
      this.push([this.tabs[this.itab].data.tile_props, {key:'', val:''}])
    },
    on_tile_minus(i){
      this.remove([this.tabs[this.itab].data.tile_props, i])
    },
  },

  created(){
    console.log(this.tabs[this.itab].data)
  },
}
</script>

<style scoped lang='sass'>
@import ../theme
#ed_tileset_sidebar
  padding: 12px
  width: 100%
  height: 100%
  background-color: $c-pane

.space
  width: 8px

#icon:hover
  color: red
  /* border: 1px solid red */

#grid-tileset, #grid-tile
  display: grid
  grid-template-columns: 1fr 1fr 0fr
  margin-top: 8px
  grid-gap: 4px
  align-items: center

  .grid-head
    margin-left: 4px
</style>

