<template lang='pug'>
form
  div
    input(
      type="checkbox"
      id="jack"
      value="Jack"
      v-model="checked"
    )
    label(for="jack")
      span Jack
      br
    input(
      type="checkbox"
      id="john"
      value="John"
      v-model="checked"
    )
    label(for="john")
      span John
      br
    input(
      type="checkbox"
      id="mike"
      value="Mike"
      v-model="checked"
    )
    label(for="mike")
      span Mike
      br
</template>


<template lang='pug'>
form
  div(
    v-for='(item,i) in items'
    :key='i'
  )
    input(
      type='checkbox'
      id=`item-${i}`
      :value='item'
      v-model='checked'
    )
    label(for=`item-${i}`)
      span {{ item }}
      br
</template>


<template lang='pug'>
#app
  // splitter between the left sidebar and main content area
  ui-splitter#splitter(
    min1='300px'
    max1='500px'
    mode='A'
  )

    // sidebar
    #sidebar.flex-col(slot='slot1')
      .flex-row
        span.fix-sz.bold name
        ui-input.expand(placeholder='input name here')
      .v-sep
      .flex-row
        span.fix-sz user
        .expand
        faicon.icon.fix-sz.clickable(
          icon='cog'
          @click='on_icon_click'
        )
      .flex-row
        span.fix-sz this is a button
        ui-tooltip.fixsz(
          text='click me'
          placement='right'
        )
          button(
            @click='on_button_click'
          ) button
      ui-tree(:root='dir_struct')
      .flex-row
        ui-dropdown(
          trigger='hover-keep'
          @item-selected='on_item_selected'
        )
          button dropdown menu
      .expand
      ui-tooltip.fix-sz(
        text='this is the bottom'
        placement='top'
      ) bottom of page
      ui-dropdown.fix-sz(
        trigger='hover-keep'
        placement='top'
        @item-selected='on_item_selected'
      )
        button dropdown menu

    // main content area
    #viewer(slot='slot2')
</template>

<template>
<div id="app">
  <button
    ref="button"
    class="toggle-button"
    @click="showPopup = !showPopup"
  >
    TOGGLE
  </button>
  <div
    v-show="showPopup"
    v-closable="{
      exclude: ['button'],
      handler: 'onClose'
    }"
    class="popup-box"
  >
    Test Popup Box
  </div>
</div>
</template>

<style>
#app {
  font-family: sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 600px;
  margin: 50px auto;
  position: relative;
}

.toggle-button {
  background: #1188FF;
  color: #FFF;
  border: 0;
  border-radius: 2px;
  padding: 10px;
  font-size: 14px;
  cursor: pointer;
  outline: none;
  transition: 0.2s all;
}

.toggle-button:hover {
  background: #1080F8;
}

.popup-box {
  position: absolute;
  left: 50%;
  top: 50px;
  transform: translateX(-50%);
  background: #F0F8FF;
  border-radius: 1px;
  box-shadow: 1px 1px 15px 0 rgba(0,0,0,0.2);
  padding: 40px;
  color: #555585;
  }
</style>

<script>
let handleOutsideClick
Vue.directive('closable', {
  bind (el, binding, vnode) {
    handleOutsideClick = (e) => {
      e.stopPropagation()
      const { handler, exclude } = binding.value
      let clickedOnExcludedEl = false
      exclude.forEach(refName => {
        if (!clickedOnExcludedEl) {
          const excludedEl = vnode.context.$refs[refName]
          clickedOnExcludedEl = excludedEl.contains(e.target)
        }
      })
      if (!el.contains(e.target) && !clickedOnExcludedEl) {
        vnode.context[handler]()
      }
    }
    document.addEventListener('click', handleOutsideClick)
    document.addEventListener('touchstart', handleOutsideClick)
  },

  unbind () {
    document.removeEventListener('click', handleOutsideClick)
    document.removeEventListener('touchstart', handleOutsideClick)
  }
})

new Vue({
  el: '#app',

  data () {
    return {
      showPopup: false
    }
  },

  methods: {
    onClose () {
      this.showPopup = false
    }
  }
})
</script>
