<template lang='pug'>
#new_tileset
  .flex-row.align-bl.spaced-8px
    span File
    ui-input(
      placeholder='file not chosen'
      :value='fname'
      disabled
      mclass='expand'
    )
    faicon.icon.hover-hl(
      icon='folder-open'
      @click='on_file_select'
    )
  .grid.hgap-20px(style='grid-template-columns: 1fr 1fr; margin-top: 8px')
    .g11.bold Image
    .g21
      .flex-row.align-bl.spaced-8px
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
    .g31
      .flex-row.align-bl.spaced-8px
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
    .g12.bold Tile
    .g22
      .flex-row.align-bl.spaced-8px
        span Width
        .expand
        ui-input(
          v-model.number='tile_width'
          mstyle='width: 60px; text-align: right'
        )
        span px
    .g32
      .flex-row.align-bl.spaced-8px
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
      let ntiles = Math.round((this.im_width*this.im_height) /
        (this.tile_width*this.tile_height))

      return {
        tile_width : this.tile_width,
        tile_height : this.tile_height,
        im_width : this.im_width,
        im_height : this.im_height,
        im_data : this.im_data,
        tileset_props: [ {key:'name', val:'forest'} ],
        tile_props: Array(ntiles).fill(0).map(x => []),
        tile_flags: [],
        tile_terra: [],
      }
    }
  },
}
</script>
