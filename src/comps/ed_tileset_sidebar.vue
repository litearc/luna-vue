<template lang='pug'>
#ed_tileset_sidebar
  .bold.full-w.text-center TILESET PROPERTIES
  #tileset
    .bold.ml-4px Key
    .bold.ml-4px Value
    ui-tooltip(
      text='Add'
      placement='left'
    )
      .flex-row.align-bl
        faicon.icon.hover-hl(
          icon='plus'
          @click='add_tileset_prop'
        )
    template(v-for='(item,i) in tabs[itab].data.tileset_props')
      ui-input(v-model='item.key' small)
      ui-input(v-model='item.val' small)
      ui-tooltip(
        text='Remove'
        placement='left'
      )
        .flex-row.align-bl
          faicon.icon.hover-hl(
            icon='minus'
            @click='remove_tileset_prop(i)'
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

</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'
import { tile_mode } from '../const.js'
import tile_anim from './tile_anim.vue'
import tile_coll from './tile_coll.vue'
import tile_flags from './tile_flags.vue'
import tile_props from './tile_props.vue'
import tile_terra from './tile_terra.vue'

export default
{
  name: 'ed_tileset_sidebar',

  data(){
    return {
      tile_mode,
      tileset_props: null,
    }
  },

  props: {
    ianim: {},
    iflag: {},
    itab: {},
    iterra: {},
    itile: { default: 0 },
    ntiles: {},
    tile_sec: {},
  },

  computed: {
    ...mapState([
      'tabs',
    ]),
  },

  components: {
    'tile-anim': tile_anim,
    'tile-coll': tile_coll,
    'tile-flags': tile_flags,
    'tile-props': tile_props,
    'tile-terra': tile_terra,
  },

  methods: {
    ...mapMutations([
      'push',
      'remove',
    ]),
    add_tileset_prop(){
      this.push([this.tileset_props, {key:'', val:''}])
    },
    remove_tileset_prop(i){
      this.remove([this.tileset_props, i])
    },
    set_tile_sec(i){
      this.$emit('set_tile_sec', i)
    },
  },

  created(){
    this.tileset_props = this.tabs[this.itab].data.tileset_props
  }
}
</script>

<style scoped lang='sass'>
@import ../theme
#ed_tileset_sidebar
  padding: 12px
  width: 100%
  height: 100%
  background-color: $c-bg-pane

#tileset
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
</style>
