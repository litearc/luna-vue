<template lang='pug'>
#tile_flags
  .flex-row.mt-8px
    .bold.ml-4px Flag
    .expand
    ui-tooltip(
      text='Add'
      placement='left'
    )
      .flex-row.align-bl
        faicon.icon.hover-hl(
          icon='plus'
          @click='on_plus'
        )
  div
    .flex-row.align-bl(
      v-for='(item,i) in o.flags'
    )
      faicon.icon.it-icon(
        icon='tag'
        :class='{selected: o.iflag == i}'
        @mousedown='set_iflag(i)'
      )
      ui-input#tile-flag.invisible.mr-4px(
        small
        v-model='item.name'
        :class='{selected: o.iflag == i, "expand": true}'
      )
      ui-tooltip(
        text='Remove'
        placement='left'
      )
        faicon.icon.hover-hl(
          icon='minus'
          @click='on_minus(i)'
        )
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'
import { bus } from './editor_tileset.vue'
let o

export default
{
  name: 'tile_flags',

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
      let ntiles = Math.round(o.im_w*o.im_h/o.tile_w/o.tile_h)
      this.push([o.flags, {
        name: 'new flag',
        tiles: Array(ntiles).fill(false)
      }])
      if (o.flags.length == 1)
        this.set_prop([o, 'iflag', 0])
    },
    on_minus(i){
      this.remove([o.flags, i])
      if (o.flags.length == 0)
        this.set_prop([o, 'iflag', null])
      else if (o.iflag >= o.flags.length)
        this.set_prop([o, 'iflag', o.flags.length-1])
    },
    set_iflag(i){
      this.set_prop([o, 'iflag', i])
    }
  },

  created(){
    o = this.o
  },
}
</script>

<style scoped lang='sass'>
@import ../theme

.selected:not(:focus)
  color: $c-blue
</style>

