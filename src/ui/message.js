import Vue from 'vue'
import message_vue from './message.vue'
let message_ctor = Vue.extend(message_vue)

let els = []
let seed = 1
let ypos0 = 20

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

  opts.on_close = () => {
    message.close(id)
  }

  let el = new message_ctor({ data: opts })
  el.id = id
  
  el.$mount()
  document.body.appendChild(el.$el)

  let ypos = ypos0
  els.forEach(el => { ypos += el.$el.offsetHeight + 16 })

  el.width = el.$el.scrollWidth
  el.ypos = ypos
  el.visible = true
  els.push(el)
}

message.close = function(id)
{
  // find index in `els` of current element
  let i = els.map(el => el.id).indexOf(id)
  let h = els[i].$el.offsetHeight

  for (let j = i+1; j < els.length; j++)
    els[j].ypos -= h+16
  
  els.splice(i, 1)
}

export default message
