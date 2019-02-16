<template>
  <CardBase>
    <div class="header" slot="header">
      <div :class="['btn-add', {'open' : open}]" @click="collapse"><img src="../assets/plus.svg" alt=""></div>
      <p>{{ headerText }}</p>
    </div>
    <div ref="collapseContent" class="words">
      <Word v-for="word in words" :key="word" :word="word" @word-sel="wordSelected($event)"/>
    </div>
  </CardBase>
</template>
<script>
import CardBase from './CardBase'
import Word from './Word'

export default {
  name: 'CardBtn',
  components: { Word, CardBase },
  props: ['header-text', 'btn-text'],
  data() {
    return {
      words: ['zoo', 'time', 'acrobat', 'chance', 'tinker'],
      open: false
    }
  },
  // TODO: Create a state machine -- switch statemnt 0 - "make you.." 1 - "seed" 2 - "drag n drop"
  methods: {
    btnClick() {
      this.open = !this.open
    },
    expandCard() {},
    collapse() {
      let el = this.$refs.collapseContent
      if (!this.open) {
        this.open = true
        this.headerText = ' pick a seed word...'
        let maxHeight = el.firstElementChild.scrollHeight
        el.setAttribute('style', `max-height: ${maxHeight + 5}px`)
      } else {
        this.headerText = 'Make your mark!'
        this.open = false
        el.removeAttribute('style')
      }
    },
    wordSelected(word) {
      console.log(word)
    }
  }
}
</script>

<style lang="sass" scoped>
  .header
    display: flex
    .btn-add
      img
        width: 50px
      transition: all 320ms ease

    .open.btn-add
      transform: rotate(45deg)
    p
      margin-left: 15px

  .words
    display: flex
    justify-content: space-evenly
    max-height: 0
    overflow: hidden
    transition: max-height 320ms ease

</style>
