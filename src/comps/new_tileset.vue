<template lang='pug'>
#new_tileset.border-blue
  .flex.flex-row.items-baseline
    span File
    ui-input.mx-2(
      placeholder='file not chosen'
      :value='fname'
      disabled
      mclass='expand'
    )
    faicon.icon.hover-hl(
      icon='folder-open'
      @click='on_file_select'
    )
  .grid.grid-cols-1.gap-1
    .grid-11.font-bold Image
    .grid-21
      .flex.flex-row.items-baseline
        span Width
        .expand
        ui-input(
          type='number'
          disabled
          placeholder='-'
          :value='im_width_text'
          mstyle='width: 60px; text-align: right'
        )
        span px
    .grid-31
      .flex.flex-row.items-baseline
        span Height
        .expand
        ui-input(
          type='number'
          disabled
          placeholder='-'
          :value='im_height_text'
          mstyle='width: 60px; text-align: right'
        )
        span px
    .grid-12.font-bold Tile
    .grid-22
      .flex.flex-row.items-baseline
        span Width
        .expand
        ui-input(
          v-model.number='tile_width'
          mstyle='width: 60px; text-align: right'
        )
        span px
    .grid-32
      .flex.flex-row.items-baseline
        span Height
        .expand
        ui-input(
          v-model.number='tile_height'
          mstyle='width: 60px; text-align: right'
        )
        span px
</template>

<script>
import image_sel_mixin from '../mixins/image_sel'

export default
{
  name: 'new_tileset',
  mixins: [ image_sel_mixin ],

  data(){
    return {
      tile_width: 16,
      tile_height: 16,
    }
  },

  methods:
  {
    editor_data(){
      return {
        tile_width : this.tile_width,
        tile_height : this.tile_height,
        im_width : this.im_width,
        im_height : this.im_height,
        im_data : this.im_data,
        tileset_props: [ {key:'name', val:'forest'} ],
        tile_props: [],
      }
    }
  },
}
</script>

<style scoped lang='sass'>
@import ../style
</style>
