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
        @click='add'
      )
  template(v-for='(item,i) in terra')
    .flex-row.align-bl
      faicon.icon.it-icon(
        icon='tag'
        :class='{selected: iterra == i}'
        @mousedown='set_iterra(i)'
      )
      ui-input.invisible(
        small
        v-model='item.name'
        :class='{selected: iterra == i, "expand": true}'
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
          @click='remove(i)'
        )
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'
import { bus } from './editor_tileset.vue'
import { coll_type } from '../const.js'

export default
{
  name: 'tile_terra',

  data(){
    return {
      terra: null,
      coll_type,
    }
  },

  props: {
    itab: {},
    iterra: {},
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
      'set_prop',
    ]),
    add(){
      this.push([this.terra, {
        name:'new terra',
        pos:{x:0, y:0},
        coll: coll_type.none,
      }])
      if (this.terra.length == 1)
        bus.$emit('set_iterra', 0)
    },
    remove(i){
      this.remove([this.terra, i])
      if (this.terra.length == 0)
        bus.$emit('set_iterra', null)
      else if (this.iterra >= this.terra.length)
        bus.$emit('set_iterra', this.terra.length-1)
    },
    set_iterra(i){
      bus.$emit('set_iterra', i)
    }
  },

  created(){
    this.terra = this.tabs[this.itab].data.tile_terra
  },
}
</script>

<style scoped lang='sass'>
@import ../theme
</style>

