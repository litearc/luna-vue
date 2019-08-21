<template lang='pug'>
div.full-sz
  .ui-splitter(
    ref='splitter'
    :class='ui_class'
    :style='ui_style'
    @mouseup='on_mouseup'
    @mousemove='on_mousemove'
  )
    #pane1.expand(:style='pane1_style')
      slot(name='slot1')
    .splitter(
      :style='splitter_style'
      @click='on_click'
      @mousedown='on_mousedown'
    )
    #pane2.expand(:style='pane2_style')
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
      let sz = `${this.pane1_sz} 15px ${this.pane2_sz}`
      if (this.dir === 'horizontal')
        style['grid-template-columns'] = sz
      if (this.dir === 'vertical')
        style['grid-template-rows'] = sz
      return style
    },
    splitter_style(){
      return {
        cursor: {horizontal:'ew-resize', vertical:'ns-resize'}[this.dir],
        'z-index': 1000
      }
    },
    pane1_style(){
      return {
        'margin-right': '-8px',
        'border-right': '1px solid gray'
      }
    },
    pane2_style(){
      return {
        'margin-left': '-8px',
      }
    }
  },

  methods: {
    on_mouseup(){
      this.active = false
      console.log('on mouse up')
    },

    on_mousemove(ev){
      if (this.active){
        let x = ev.clientX
        let w1 = `${x}px`
        let w2 = this.$refs.splitter.offsetWidth - x - 15 + 'px'
        this.pane1_sz = `${w1}`
        this.pane2_sz = `${w2}`
      }
    },

    on_mousedown(ev){
      this.active = true
      let w = this.$refs.splitter.offsetWidth,
          h = this.$refs.splitter.offsetHeight
      this.x = ev.clientX
      this.y = ev.clientY
      console.log('on mouse down', w, h)
    },

    on_click(){
    },
  }
}
</script>
