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


