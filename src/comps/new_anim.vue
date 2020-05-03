<template lang='pug'>
#new_anim
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
    .g12.bold Animation
    .g22
      .flex-row.align-bl.spaced-8px
        span Width
        .expand
        ui-input(
          type='number'
          value='64'
          mstyle='width: 60px; text-align: right'
        )
        span px
    .g32
      .flex-row.align-bl.spaced-8px
        span Height
        .expand
        ui-input(
          type='number'
          value='64'
          mstyle='width: 60px; text-align: right'
        )
        span px
</template>

<script>
import image_sel_mixin from '../mixins/image_sel'

export default
{
  name: 'new_anim',
  mixins: [ image_sel_mixin ],
}
</script>

<style scoped lang='sass'>
</style>
