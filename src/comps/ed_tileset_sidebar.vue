<template lang='pug'>
#ed_tileset_sidebar
  .bold.full-w.text-center TILESET PROPERTIES
  #grid-tileset
    .bold.ml-4px Key
    .bold.ml-4px Value
    ui-tooltip(
      text='Add'
      placement='left'
    )
      faicon.icon.hover-hl(
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
        faicon.icon.hover-hl(
          icon='minus'
          @click='on_tileset_minus(i)'
        )
  .hdivider
  div
    .tile-title(
      :class='{active: tile_sec == tile_mode.props}'
      @click='set_tile_sec(tile_mode.props)'
      ) TILE PROPERTIES
    .tile-title(
      :class="{active: tile_sec == tile_mode.flags}"
      @click='set_tile_sec(tile_mode.flags)'
    ) TILE FLAGS
  #grid-tile(v-if='tile_sec == tile_mode.props')
    .bold.ml-4px Key
    .bold.ml-4px Value
    ui-tooltip(
      text='Add'
      placement='left'
    )
      faicon.icon.hover-hl(
        icon='plus'
        @click='on_tile_plus'
      )
    template(v-for='(item,i) in tabs[itab].data.tile_props[curr_tile]')
      ui-input(v-model='item.key')
      ui-input(v-model='item.val')
      ui-tooltip(
        text='Remove'
        placement='left'
      )
        faicon.icon.hover-hl(
          icon='minus'
          @click='on_tile_minus(i)'
        )
  #flags(v-if='tile_sec == tile_mode.flags')
    .flex-row.my-8px
      .bold.ml-4px Flag
      .expand
      ui-tooltip(
        text='Add'
        placement='left'
      )
        faicon.icon.hover-hl(
          icon='plus'
          @click='on_tile_flag_plus'
        )
    div
      .flex-row.align-bl(
        v-for='(item,i) in tabs[itab].data.tile_flags'
      )
        faicon.it-icon(
          icon='tag'
          :class='{selected: iflag == i}'
          @mousedown='select_tile_flag(i)'
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
            @click='on_tile_flag_minus(i)'
          )
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'
import { tile_mode } from '../const.js'
import { bus } from './editor_tileset.vue'
let tileset_props, tile_props, tile_flags

export default
{
  name: 'ed_tileset_sidebar',

  data(){
    return {
      h: '15px',
      fill: '#94989a',
      tile_sec: 0, // 0: 'properties', 1: 'flags'
      tile_mode,
    }
  },

  props: {
    iflag: {},
    itab: {},
    curr_tile: { default: 0 },
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
    on_tileset_plus(){
      this.push([tileset_props, {key:'', val:''}])
    },
    on_tileset_minus(i){
      this.remove([tileset_props, i])
    },
    on_tile_plus(){
      this.push([tile_props[this.curr_tile], {key:'', val:''}])
    },
    on_tile_minus(i){
      this.remove([tile_props[this.curr_tile], i])
    },
    on_tile_flag_plus(){
      this.push([tile_flags, {name:'new tag', tiles:Array(this.ntiles).fill(false)}])
      if (tile_flags.length == 1)
        this.$emit('set_iflag', 0)
    },
    on_tile_flag_minus(i){
      this.remove([tile_flags, i])
      if (tile_flags.length == 0)
        this.$emit('set_iflag', null)
      if (this.iflag >= tile_flags.length)
        this.$emit('set_iflag', tile_flags.length-1)
      bus.$emit('tile_flag_changed', this.iflag)
    },
    set_tile_sec(i){
      this.tile_sec = i
      bus.$emit('tile_sec_changed', i)
    },
    select_tile_flag(i){
      this.$emit('set_iflag', i)
    },
  },

  created(){
    tileset_props = this.tabs[this.itab].data.tileset_props
    tile_props = this.tabs[this.itab].data.tile_props
    tile_flags = this.tabs[this.itab].data.tile_flags
  },
}
</script>

<style scoped lang='sass'>
@import ../theme
#ed_tileset_sidebar
  padding: 12px
  width: 100%
  height: 100%
  background-color: $c-bg-pane

#grid-tileset, #grid-tile
  display: grid
  grid-template-columns: 1fr 1fr 0fr
  margin-top: 8px
  grid-gap: 4px
  align-items: center

.tile-title
  width: 50%
  display: inline-block
  font-weight: bold
  color: $c-text-dim
  text-align: center
  &.active
    color: $c-text

#tile-flag.selected:not(:focus)
  color: $c-blue
</style>

