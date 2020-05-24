<template lang='pug'>
#tile_terra.key-value-grid
  .bold Terra
  .bold Collision
  ui-tooltip(
    text='Add'
    placement='left'
  )
    .flex-row.align-bl
      faicon.icon.hover-hl(
        icon='plus'
        @click='on_plus'
      )
  template(v-for='(item,i) in o.terra')
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
    .flex-row.align-bl
      faicon.icon.mr-4px(
        :class='{inactive: item.coll !== coll_type.none}'
        :icon='["far", "dot-circle"]'
        @click='set_prop([item, "coll", coll_type.none])'
      )
      faicon.icon(
        :class='{inactive: item.coll !== coll_type.all}'
        :icon='["far", "times-circle"]'
        @click='set_prop([item, "coll", coll_type.all])'
      )
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
import { coll_type } from '../const.js'
let o

export default
{
  name: 'tile_terra',

  data(){
    return {
      coll_type,
    }
  },

  props: {
    o: {},
  },

  methods: {
    ...mapMutations([
      'push',
      'remove',
      'set_prop',
    ]),
    on_plus(){
      this.push([o.terra, {
        name:'new terra',
        pos: {x:0, y:0},
        coll: coll_type.none,
      }])
      if (o.terra.length == 1)
        this.set_prop([o, 'iterra', 0])
    },
    on_minus(i){
      this.remove([o.terra, i])
      if (o.terra.length == 0)
        this.set_prop([o, 'iterra', null])
      else if (o.iterra >= o.terra.length)
        this.set_prop([o, 'iterra', o.terra.length-1])
    },
    set_iterra(i){
      this.set_prop([o, 'iterra', i])
    }
  },

  created(){
    o = this.o
  },
}
</script>

<style scoped lang='sass'>
@import ../theme
</style>

