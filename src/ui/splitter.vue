<template lang='pug'>
div.full
  .ui-splitter(
    ref='splitter'
    :class='ui_class'
    :style='ui_style'
  )
    #pane1.pane(ref='pane1')
      slot(name='slot1')
    .splitter
    #pane2.pane
      slot(name='slot2')
</template>

<script>
let on = window.addEventListener
let off = window.removeEventListener
let dist = 10 // pixels, activate splitter

function to_px(s, w){
  return (s[s.length-1] === 'x') ? parseFloat(s) : parseFloat(s)*w
}

export default
{
  name: 'ui-splitter',

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
  
  props: {
    dir: { default: 'horizontal' },
    limits: { default: () => [0, 100] },
    // these define the min and max sizes for panes 1 and 2.
    // the default values mean "no restriction".
    // only sizes for one of the panes should be set.
    init1: { default: null }, // initial size of pane 1 (default is 1/2)
    min1: { default: null },
    max1: { default: null },
    min2: { default: null },
    max2: { default: null },
    mode: { default: 'C' }, // specifies how panes resize when window resizes
  },

  computed:
  {
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

  methods:
  {
    // acceptable range in px where splitter can be. (2-array)
    ok_range(){
      let el = this.$refs.splitter
      let w = (this.dir === 'horizontal') ? el.offsetWidth : el.offsetHeight
      let min1 = (this.min1 === null) ? 0   : to_px(this.min1, w)
      let max1 = (this.max1 === null) ? w-1 : to_px(this.max1, w)
      let min2 = (this.min2 === null) ? 0   : to_px(this.min2, w)
      let max2 = (this.max2 === null) ? w-1 : to_px(this.max2, w)
      let min = Math.max(min1, min2)
      let max = Math.min(max1, max2)
      if (max < min){ // no acceptable position for splitter
        console.log(`${min1} ${max1} ${min2} ${max2}`)
        console.log('no acceptable position for splitter found');
        return null
      } 
      // for 'B' mode, where slot2 is fixed size, need to adjust size
      if (this.mode === 'B'){
        let tmp = min
        min = w-max
        max = w-tmp
      }
      return [min, max]
    },

    on_mousemove(ev){
      let el = this.$refs.splitter
      let tot_size = (this.dir === 'horizontal') ?
        el.offsetWidth : el.offsetHeight
      let pane1 = this.$refs.pane1
      let pos = el.getBoundingClientRect()
      let mouse_pos = (this.dir === 'horizontal') ? ev.x-pos.left : ev.y-pos.top
      let splitter_pos = (this.dir === 'horizontal') ?
        pane1.offsetWidth : pane1.offsetHeight
      this.near = (Math.abs(mouse_pos-splitter_pos) < 10)

      let r = this.ok_range()
      if (r === null || !this.resizing) return

      if (mouse_pos < r[0]) mouse_pos = r[0]
      if (mouse_pos > r[1]) mouse_pos = r[1]

      switch (this.mode){
        case 'A':
          this.pane1_sz = `${mouse_pos}px`
          this.pane2_sz = `1fr`
          break
        case 'B':
          this.pane1_sz = `1fr`
          this.pane2_sz = `${tot_size-mouse_pos}px`
          break
        case 'C':
          this.pane1_sz = `${mouse_pos/tot_size}fr`
          this.pane2_sz = `${1-mouse_pos/tot_size}fr`
          break
      }
    },

    on_mousedown(){
      if (!this.near) return
      this.resizing = true
      document.documentElement.style.cursor = 'grabbing'
      document.body.classList.add('no-pointer-events')
      document.body.classList.add('non-selectable')
    },

    on_mouseup(){
      this.resizing = false
      document.documentElement.style.cursor = ''
      document.body.classList.remove('no-pointer-events')
      document.body.classList.remove('non-selectable')
    },
  }, // methods

  mounted(){
    // set the initial size so that it meets the requirements
    let r = this.ok_range()
    if (r !== null){
      let pane1 = this.$refs.pane1
      let pos = (this.dir === 'horizontal') ?
        pane1.offsetWidth : pane1.offsetHeight
      let el = this.$refs.splitter
      let tot_size = (this.dir === 'horizontal') ?
        el.offsetWidth : el.offsetHeight
      if (pos < r[0]) pos = r[0]
      if (pos > r[1]) pos = r[1]

      switch (this.mode){
        case 'A':
          this.pane1_sz = `${pos}px`
          this.pane2_sz = `1fr`
          break
        case 'B':
          this.pane1_sz = `1fr`
          this.pane2_sz = `${tot_size-pos}px`
          break
        case 'C':
          this.pane1_sz = `${pos/tot_size}fr`
          this.pane2_sz = `${1-pos/tot_size}fr`
          break
      }
    }
  },

  activated(){
    on('mousemove', this.on_mousemove)
    on('mouseup', this.on_mouseup)
    on('mousedown', this.on_mousedown)
  },

  deactivated(){
    off('mousemove', this.on_mousemove)
    off('mouseup', this.on_mouseup)
    off('mousedown', this.on_mousedown)
  },
}
</script>

<style scoped lang='sass'>
@import ../theme

.ui-splitter
  
  &.horizontal 
    & > .pane:first-child
      margin-right: -1px
    & > .pane:last-child
      margin-left: -1px
    & > .splitter
      cursor: ew-resize
      z-index: 1000

  &.vertical 
    & > .pane:first-child
      margin-bottom: -1px
    & > .pane:last-child
      margin-top: -1px
    & > .splitter
      cursor: ns-resize
      z-index: 1000

#pane1, #pane2
  overflow: hidden
</style>
