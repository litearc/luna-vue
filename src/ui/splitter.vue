<template lang='pug'>
div.full-sz
  .ui-splitter(
    ref='splitter'
    :class='ui_class'
    :style='ui_style'
    @mouseup='on_mouseup'
    @mousemove='on_mousemove'
  )
    #pane1.expand
      slot(name='slot1')
    .splitter(
      :style='splitter_style'
      @click='on_click'
      @mousedown='on_mousedown'
    )
    #pane2.expand
      slot(name='slot2')
</template>

<script>
export default
{
  name: 'ui-splitter',
  
  props: {
    dir: { default: 'horizontal' },
    limits: { default: () => [0, 100] }
  },

  data(){
    return {
      active: false,
      pos: null,
      has_moved: false,
      pane1_sz: '1fr',
      pane2_sz: '1fr',
      x: null,
      y: null,
    }
  },

  computed: {
    ui_class(){
      return {
        horizontal: this.dir === 'horizontal',
        vertical: this.dir === 'vertical',
      }
    },
    ui_style(){
      let style = {
        display: 'grid',
        width: '100%',
        height: '100%',
      }
      let sz = `${this.pane1_sz} 1px ${this.pane2_sz}`
      if (this.dir === 'horizontal')
        style['grid-template-columns'] = sz
      if (this.dir === 'vertical')
        style['grid-template-rows'] = sz
      return style
    },
    splitter_style(){
      return {
        'background-color': 'red',
        cursor: {horizontal:'ew-resize', vertical:'ns-resize'}[this.dir],
      }
    }
  },

  methods: {
    on_mouseup(){
      this.active = false
    },

    on_mousemove(){},

    on_mousedown(){},

    on_click(){
      this.active = true
      let w = this.$refs.splitter.offsetWidth,
          h = this.$refs.splitter.offsetHeight
      console.log(w, h)
    },
  }
}
</script>
