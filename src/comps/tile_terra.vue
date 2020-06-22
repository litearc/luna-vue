<template lang='pug'>
#tile_terra
  // header section
  .bold Terra
  .bold Collision
  .bold Shape
  ui-tooltip(
    text='Add'
    placement='left'
  )
    .flex-row.align-bl
      faicon.icon.hover-hl(
        icon='plus'
        @click='on_plus'
      )

  // list of terra
  template(v-for='(item,i) in o.terra')
    // tag + name (input)
    .flex-row.align-bl
      faicon.icon.it-icon(
        icon='tag'
        :class='{selected: o.iterra == i}'
        @mousedown='set_iterra(i)'
      )
      ui-input.invisible(
        small
        v-model='item.name'
        :class='{selected: o.iterra == i, "expand": true}'
      )
    // icons to set collision type
    .flex-row.align-bl
      faicon.icon.icon-w.hover-hl.mr-4px(
        :class='{inactive: item.coll !== coll_type.none}'
        :icon='["far", "dot-circle"]'
        @click='set_prop([item, "coll", coll_type.none])'
      )
      faicon.icon.icon-w.hover-hl(
        :class='{inactive: item.coll !== coll_type.all}'
        :icon='["far", "times-circle"]'
        @click='set_prop([item, "coll", coll_type.all])'
      )
    // icons to set terra shape
    .flex-row.align-bl
      ui-icon.icon.icon-w.hover-hl(
        icon='terra4x3' height='12px' text base
        :class='{inactive: item.shape !== terra_shape_type._4x3}'
        @click='set_prop([item, "shape", terra_shape_type._4x3])'
      )
      ui-icon.icon.icon-w.hover-hl(
        icon='terra5x1' height='12px' text base
        :class='{inactive: item.shape !== terra_shape_type._5x1}'
        @click='set_prop([item, "shape", terra_shape_type._5x1])'
      )
    // remove terra icon
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
import { coll_type, terra_shape_type } from '../const.js'

export default
{
  name: 'tile_terra',

  data(){
    return {
      coll_type,
      terra_shape_type,
    }
  }, // data

  props: {
    o: {},
  }, // props

  methods: {
    ...mapMutations([
      'push',
      'remove',
      'set_prop',
    ]),

    // add terra
    on_plus(){
      this.push([this.o.terra, {
        name:'new terra',
        pos: {x:0, y:0},
        coll: coll_type.none,
        shape: terra_shape_type._4x3,
      }])
      if (this.o.terra.length == 1)
        this.set_prop([this.o, 'iterra', 0])
    },

    // remove terra
    on_minus(i){
      this.remove([this.o.terra, i])
      if (this.o.terra.length == 0)
        this.set_prop([this.o, 'iterra', null])
      else if (this.o.iterra >= this.o.terra.length)
        this.set_prop([this.o, 'iterra', this.o.terra.length-1])
    },

    // set terra index
    set_iterra(i){
      this.set_prop([this.o, 'iterra', i])
    },
  },
}
</script>

<style scoped lang='sass'>
@import ../theme

#tile_terra
  display: grid
  grid-template-columns: 2fr 1fr 1fr 0fr
  margin-top: 8px
  grid-column-gap: 4px
  grid-row-gap: 0px
  align-items: center

.selected:not(:focus)
  color: $c-blue
</style>
