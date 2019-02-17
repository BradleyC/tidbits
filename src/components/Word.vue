<template>
  <div :id="word" @click="$emit('word-sel', word)" class="word" draggable="true" @dragstart="drag($event)">
    {{ word }}
  </div>
</template>

<script>
export default {
  name: 'WordChip',
  props: ['word', 'is-draggable'],
  data() {
    return {
      draggable: this.isDraggable,
      yes: 'true'
    }
  },
  methods: {
    drag(ev) {
      console.log(ev)
      ev.dataTransfer.setData('text', ev.target.id)
      console.log(ev)
    }
  }
}
</script>

<style lang="sass" scoped>
.word
  cursor: pointer
  padding: 5px
  margin: 5px
  box-shadow: 0 2px 1px -1px rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 1px 3px 0 rgba(0,0,0,.12)
  &:hover
    box-shadow: 1px 4px 1px -1px rgba(0,0,0,.2), 1px 1px 1px 0 rgba(0,0,0,.14), 0 1px 3px 0 rgba(0,0,0,.12)
</style>
