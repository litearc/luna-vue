<template lang='pug'>
div.full-sz
  .ui-splitter(
    ref='splitter'
    :class='ui_class'
    :style='ui_style'
  )
    #pane1.pane.expand(ref='pane1')
      slot(name='slot1')
    .splitter
    #pane2.pane.expand
      slot(name='slot2')
</template>

<script>
let on = window.addEventListener
let dist = 10 // pixels, activate splitter

export default
{
  name: 'ui-splitter',
  
  props: {
    dir: { default: 'horizontal' },
    limits: { default: () => [0, 100] },
    // these define the min and max sizes for panes 1 and 2.
    // the default values mean "no restriction".
    // only sizes for one of the panes should be set.
    min1: { default: null },
    max1: { default: null },
    min2: { default: null },
    max2: { default: null },
  },

  data(){
    return {
      near: false,
      resizing: false,
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
      // we make the splitter width = 0 below, and let js figure out when the
      // mouse is over (or near) it to do the resizing
      let sz = `${this.pane1_sz} 0px ${this.pane2_sz}`
      if (this.dir === 'horizontal'){
        style['grid-template-columns'] = sz
        if (this.near && !this.resizing)
          style['cursor'] = 'ew-resize'
      }
      if (this.dir === 'vertical'){
        style['grid-template-rows'] = sz
        if (this.near && !this.resizing)
          style['cursor'] = 'ns-resize'
      }
      return style
    },
  },

  mounted(){
    // if min_width or max_width are defined, and current sizes are outsize
    // bounds, set current size appropriately
    let split = this.$refs.splitter
    let b = (this.dir === 'horizontal') ? split.offsetWidth : split.offsetHeight
    let a = b/2
    if (this.min1 !== null) a = Math.max(a, parseInt(this.min1))
    if (this.max1 !== null) a = Math.min(a, parseInt(this.max1))
    this.pane1_sz = `${a/b}fr`
    this.pane2_sz = `${(b-a)/b}fr`

    on('mousemove', ev => {
      let split = this.$refs.splitter
      let pos = split.getBoundingClientRect()
      let x = pos.top,
          y = pos.left
      let pane1 = this.$refs.pane1
      this.near = (Math.abs((ev.x-x)-pane1.offsetWidth) < 10)
      
      if (!this.resizing) return

      let a, b
      // for some reason, the first pane can't be completely 1fr size
      if (this.dir === 'horizontal'){
        b = split.offsetWidth
        a = Math.min(Math.max(ev.x-x, 0), b-1)
      }
      else {
        b = split.offsetHeight
        a = Math.min(Math.max(ev.y-y, 0), b-1)
      }

      if (this.min1 !== null) a = Math.max(a, parseInt(this.min1))
      if (this.max1 !== null) a = Math.min(a, parseInt(this.max1))

      this.pane1_sz = `${a/b}fr`
      this.pane2_sz = `${(b-a)/b}fr`
    })

    on('mouseup', () => {
      this.resizing = false
      document.documentElement.style.cursor = ''
      document.body.classList.remove('no-pointer-events')
      document.body.classList.remove('non-selectable')
    })

    on('mousedown', ev => {
      if (!this.near) return
      this.resizing = true
      document.documentElement.style.cursor = 'grabbing'
      document.body.classList.add('no-pointer-events')
      document.body.classList.add('non-selectable')
    })
  },
}
</script>
