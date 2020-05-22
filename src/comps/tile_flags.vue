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
          @click='add'
        )
  div
    .flex-row.align-bl(
      v-for='(item,i) in flags'
    )
      faicon.icon.it-icon(
        icon='tag'
        :class='{selected: iflag == i}'
        @mousedown='set_iflag(i)'
      )
      ui-input#tile-flag.invisible.mr-4px(
        small
        v-model='item.name'
        :class='{selected: iflag == i, "expand": true}'
      )
      ui-tooltip(
        text='Remove'
        placement='left'
      )
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
  name: 'tile_flags',

  data(){
    return {
      flags: null,
    }
  },

  props: {
    itab: {},
    ntiles: {},
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
      this.push([this.flags, {
        name:'new flag',
        tiles:Array(this.ntiles).fill(false)
      }])
      if (this.flags.length == 1)
        bus.$emit('set_iflag', 0)
    },
    remove(i){
      this.remove([this.flags, i])
      if (this.flags.length == 0)
        this.$emit('set_iflag', null)
      else if (this.iflag >= this.flags.length)
        this.$emit('set_iflag', this.flags.length-1)
    },
    set_iflag(i){
      bus.$emit('set_iflag', i)
    }
  },

  created(){
    this.flags = this.tabs[this.itab].data.flags
  },
}
</script>

<style scoped lang='sass'>
@import ../theme
</style>

