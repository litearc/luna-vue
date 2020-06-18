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
      let ntiles = Math.round(this.o.im_w*this.o.im_h/this.o.tile_w/this.o.tile_h)
      this.push([this.o.flags, {
        name: 'new flag',
        tiles: Array(ntiles).fill(false)
      }])
      if (this.o.flags.length == 1)
        this.set_prop([this.o, 'iflag', 0])
    },
    on_minus(i){
      this.remove([this.o.flags, i])
      if (this.o.flags.length == 0)
        this.set_prop([this.o, 'iflag', null])
      else if (this.o.iflag >= this.o.flags.length)
        this.set_prop([this.o, 'iflag', this.o.flags.length-1])
    },
    set_iflag(i){
      this.set_prop([this.o, 'iflag', i])
    }
  },
}
</script>

<style scoped lang='sass'>
@import ../theme

.selected:not(:focus)
  color: $c-blue
</style>

