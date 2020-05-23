<template lang='pug'>
#tile_anim
  .flex-row.align-bl
    ui-checkbox.mt-8px.mr-8px(
      :items='["Use one duration for all frames"]'
      @clicked='use_one_dur = arguments[0]'
    )
    ui-input.expand(
      small
      right
      :disabled='!use_one_dur'
      type='number'
      placeholder='ms'
    )

  .flex-row.full-w.align-center.mt-8px
    canvas.no-shrink.block.expand.mr-8px.border-red(ref='anim_tiles')
    ui-tooltip(
      text='Remove'
      placement='left'
    )
      faicon.icon.hover-hl(
        icon='minus'
      )

  .flex-row.mt-8px
    .bold.ml-4px Anim
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
      v-for='(item,i) in anims'
    )
      faicon.icon.it-icon(
        icon='tag'
        :class='{selected: ianim == i}'
        @mousedown='set_ianim(i)'
      )
      ui-input#tile-flag.invisible.mr-4px(
        small
        v-model='item.name'
        :class='{selected: ianim == i, "expand": true}'
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
  name: 'tile_anim',

  data(){
    return {
      anims: null,
      use_one_dur: false,
    }
  },

  props: {
    ianim: {},
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
    on_plus(){
      this.push([this.flags, {
        name:'new flag',
        tiles:Array(this.ntiles).fill(false),
      }])
      if (this.flags.length == 1)
        bus.$emit('set_iflag', 0)
    },
    on_minus(i){
      this.remove([this.flags, i])
      if (this.flags.length == 0)
        bus.$emit('set_iflag', null)
      else if (this.iflag >= this.flags.length)
        bus.$emit('set_iflag', this.flags.length-1)
    },
    set_iflag(i){
      bus.$emit('set_iflag', i)
    }
  },

  created(){
    this.anims = this.tabs[this.itab].data.tile_anim
  },

}
</script>

<style scoped lang='sass'>
@import ../theme
</style>

