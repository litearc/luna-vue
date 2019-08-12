import Vue from 'vue'
import message_vue from './message.vue'
let message_ctor = Vue.extend(message_vue)

let els_top = [],
    els_bottom = [],
    seed = 1,
    ypos0 = 10

const message = function(opts)
{
  if (Vue.prototype.$isServer)
    return

  opts = opts || {}

  if (typeof opts === 'string')
    opts = {
      message: opts
    }

  let id = seed++
  let el = new message_ctor({ data: opts })

  // the id is a unique string that is used when shifting later messages up/down
  // on the list when this one is removed
  el.id = id
  el.on_close = () => {
    message.close(el)
  }
  
  el.$mount()
  document.body.appendChild(el.$el)

  let ypos
  let els = (el.position === 'top') ? els_top : els_bottom

  if (el.position === 'top'){
    ypos = ypos0
    els.forEach(el => { ypos += el.$el.offsetHeight + 16 })
  }
  else {
    ypos = window.innerHeight-ypos0-34
    els.forEach(el => { ypos -= el.$el.offsetHeight + 16 })
  }
    
  el.width = el.$el.scrollWidth
  el.ypos = ypos
  el.visible = true
  els.push(el)
}

message.close = function(el)
{
  let els = (el.position === 'top') ? els_top : els_bottom

  // find index in `els` of current element
  let i = els.map(e => e.id).indexOf(el.id)
  let h = els[i].$el.offsetHeight

  let sign = (el.position === 'top') ? -1 : +1

  for (let j = i+1; j < els.length; j++)
    els[j].ypos += sign * (h+16)
  
  els.splice(i, 1)
}

export default message
