<template lang='pug'>
.ui-splitter(
  :style='style'
  @mouseup='on_mouseup'
  @mousemove='on_mousemove'
)
  #pane1.pane
    slot(:name='slot1')
  .splitter(
    :style='splitter_style'
    @click='on_click'
    @mousedown='on_mousedown'
  )
  #pane2.pane
    slot(:name='slot2')
</template>

<script>
export default
{
  name: 'ui-splitter',
  
  props: {
    dir: { default: 'horizontal' },
    limits: { default: [0, 100] }
  },

  data(){
    return {
      active: false,
      pos: null,
      has_moved: false,
    }
  },

  methods: {
    on_mouseup(){},

    on_mousemove(){},

    on_mousedown(){},

    on_click(){},
  }
}
</script>