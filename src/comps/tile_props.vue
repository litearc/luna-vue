<template lang='pug'>
#tile_tiles.key-value-grid
  // header section
  .bold.ml-4px Key
  .bold.ml-4px Value
  ui-tooltip(
    text='Add'
    placement='left'
  )
    .flex-row.align-bl
      faicon.icon.hover-hl(
        icon='plus'
        @click='on_plus'
      )

  // list of props
  template(v-for='(item,i) in o.props[o.itile]')
    ui-input(v-model='item.key' small)
    ui-input(v-model='item.val' small)
    ui-tooltip(
      text='Remove'
      placement='left'
    )
      .flex-row.align-bl
        faicon.icon.hover-hl(
          icon='minus'
          @click='on_minus(i)'
        )
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'
import { bus } from './editor_tileset.vue'

export default
{
  name: 'tile_props',

  props: {
    o: {},
  },

  methods: {
    ...mapMutations([
      'push',
      'remove',
    ]),

    // add prop to current tile.
    on_plus(){
      this.push([this.o.props[this.o.itile], {key:'', val:''}])
    },

    // remove prop to current tile.
    on_minus(i){
      this.remove([this.o.props[this.o.itile], i])
    },
  },
}
</script>

<style scoped lang='sass'>
@import ../theme
</style>
