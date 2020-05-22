<template lang='pug'>
#tile_tiles
  .bold.ml-4px Key
  .bold.ml-4px Value
  ui-tooltip(
    text='Add'
    placement='left'
  )
    .flex-row.align-bl
      faicon.icon.hover-hl(
        icon='plus'
        @click='add'
      )
  template(v-for='(item,i) in props[curr_tile]')
    ui-input(v-model='item.key' small)
    ui-input(v-model='item.val' small)
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

export default
{
  name: 'tile_props',

  data(){
    return {
      props: null,
    }
  },

  props: {
    curr_tile: {},
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
    add(){
      this.push([props[this.curr_tile], {key:'', val:''}])
    },
    remove(i){
      this.remove([props[this.curr_tile], i])
    },
  },

  created(){
    this.props = this.tabs[this.itab].data.tile_props
  },
}
</script>

<style scoped lang='sass'>
@import ../theme
</style>
