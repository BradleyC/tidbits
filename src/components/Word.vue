<template>
  <div @click="$emit('word-sel', word)" class="word">
    {{ word }}
  </div>
</template>

<script>
export default {
  name: 'WordChip',
  props: ['word', 'is-draggable'],
  methods: {
    selectWord() {
      // emit event selected
    }
  }
}
</script>

<style lang="sass" scoped>
.word
  cursor: pointer
  padding: 5px
  margin: 5px
  height: 4vw
  width: min-content
  box-shadow: 0 2px 1px -1px rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 1px 3px 0 rgba(0,0,0,.12)
  &:hover
    box-shadow: 1px 4px 1px -1px rgba(0,0,0,.2), 1px 1px 1px 0 rgba(0,0,0,.14), 0 1px 3px 0 rgba(0,0,0,.12)
</style>
