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
      ui-input(v-model='item.key' small)
      ui-input(v-model='item.val' small)
      ui-tooltip(
        text='Remove'
        placement='left'
      )
        faicon.icon.hover-hl(
          icon='minus'
          @click='on_tileset_minus(i)'
        )
  .hdivider
  .bold.full-w.text-center.mb-8px TILE PROPERTIES
  div
    .tile-title(
      :class='{active: tile_sec == tile_mode.props}'
      @click='set_tile_sec(tile_mode.props)'
      ) PROPS
    .tile-title(
      :class="{active: tile_sec == tile_mode.flags}"
      @click='set_tile_sec(tile_mode.flags)'
    ) FLAGS
    .tile-title(
      :class="{active: tile_sec == tile_mode.coll}"
      @click='set_tile_sec(tile_mode.coll)'
    ) COLLISION
    .tile-title(
      :class="{active: tile_sec == tile_mode.terra}"
      @click='set_tile_sec(tile_mode.terra)'
    ) TERRA
    .tile-title(
      :class="{active: tile_sec == tile_mode.anim}"
      @click='set_tile_sec(tile_mode.anim)'
    ) ANIM
  #grid-tile(v-if='tile_sec == tile_mode.props')
    .bold.ml-4px Key
    .bold.ml-4px Value
    ui-tooltip(
      text='Add'
      placement='left'
    )
      faicon.icon.hover-hl(
        icon='plus'
        @click='on_tile_prop_plus'
      )
    template(v-for='(item,i) in tabs[itab].data.tile_props[curr_tile]')
      ui-input(v-model='item.key' small)
      ui-input(v-model='item.val' small)
      ui-tooltip(
        text='Remove'
        placement='left'
      )
        faicon.icon.hover-hl(
          icon='minus'
          @click='on_tile_prop_minus(i)'
        )
  #flags(v-if='tile_sec == tile_mode.flags')
    .flex-row.mt-8px
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
            @click='on_tile_flag_minus(i)'
          )
  #grid-terra(v-if='tile_sec == tile_mode.terra')
    .bold Terra
    .bold Collision
    ui-tooltip(
      text='Add'
      placement='left'
    )
      faicon.icon.hover-hl(
        icon='plus'
        @click='on_tile_terra_plus'
      )
    template(v-for='(item,i) in tabs[itab].data.tile_terra')
      .flex-row.align-bl
        faicon.it-icon(
          icon='tag'
          :class='{selected: iterra == i}'
          @mousedown='set_iterra(i)'
        )
        ui-input#tile-terra.invisible(
          small
          v-model='item.name'
          :class='{selected: iterra == i, "expand": true}'
        )
      .flex-row.align-bl
        faicon.mr-4px(
          :icon='["far", "dot-circle"]'
        )
        faicon(
          :icon='["far", "times-circle"]'
        )
      ui-tooltip(
        text='Remove'
        placement='left'
      )
        faicon.icon.hover-hl(
          icon='minus'
          @click='on_tile_terra_minus(i)'
        )
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'
import { tile_mode, coll_type } from '../const.js'
import { bus } from './editor_tileset.vue'
let tileset_props, tile_props, tile_flags, tile_terra

export default
{
  name: 'ed_tileset_sidebar',

  data(){
    return {
      tile_mode,
    }
  },

  props: {
    curr_tile: { default: 0 },
    iflag: {},
    itab: {},
    iterra: {},
    ntiles: {},
    tile_sec: {},
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
    on_tile_prop_plus(){
      this.push([tile_props[this.curr_tile], {key:'', val:''}])
    },
    on_tile_prop_minus(i){
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
      else if (this.iflag >= tile_flags.length)
        this.$emit('set_iflag', tile_flags.length-1)
    },
    on_tile_terra_plus(){
      this.push([tile_terra, {name:'new terra', pos:{x:0, y:0}, coll: coll_type.none}])
      if (tile_terra.length == 1)
        this.$emit('set_iterra', 0)
    },
    on_tile_terra_minus(i){
      this.remove([tile_terra, i])
      if (tile_terra.length == 0)
        this.$emit('set_iterra', null)
      else if (this.iterra >= tile_terra.length)
        this.$emit('set_iterra', tile_terra.length-1)
    },
    set_tile_sec(i){
      this.$emit('set_tile_sec', i)
    },
    set_iflag(i){
      this.$emit('set_iflag', i)
    },
    set_iterra(i){
      this.$emit('set_iterra', i)
    },
  },

  created(){
    tileset_props = this.tabs[this.itab].data.tileset_props
    tile_props = this.tabs[this.itab].data.tile_props
    tile_flags = this.tabs[this.itab].data.tile_flags
    tile_terra = this.tabs[this.itab].data.tile_terra
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

#grid-tileset, #grid-tile, #grid-terra
  display: grid
  grid-template-columns: 1fr 1fr 0fr
  margin-top: 8px
  grid-column-gap: 4px
  grid-row-gap: 0px
  align-items: center

.tile-title
  width: 20%
  display: inline-block
  font-weight: bold
  color: $c-text-dim
  text-align: center
  &.active
    color: $c-text

#tile-flag.selected:not(:focus), #tile-terra.selected:not(:focus)
  color: $c-blue
</style>

