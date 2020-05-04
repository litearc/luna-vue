<template lang='pug'>
  span editor_map {{ val }}
</template>

<script>
export default
{
  name: 'editor_map',

  data(){
    return {
      val: null,
    }
  },

  created(){
    this.val = Math.floor(Math.random() * 101);
  },
}
</script>
