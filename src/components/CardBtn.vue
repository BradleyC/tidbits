<template>
  <CardBase>
    <div class="header" slot="header">
      <div :class="['btn-add', {'open' : open}]" @click="btnClick"><img src="../assets/plus.svg" alt=""></div>
      <p>{{ headertxt }}</p>
    </div>
    <div ref="collapseContent" class="words">
      <div v-if="state === 1" class="word-box">
        <Word v-for="word in words" :key="word" :word="word" @word-sel="wordSelected($event)"/>
      </div>
      <DragnDrop ref="dragNDrop" v-if="state === 2"/>
    </div>
  </CardBase>
</template>
<script>
import CardBase from './CardBase'
import Word from './Word'
import DragnDrop from './DragnDrop'

export default {
  name: 'CardBtn',
  components: { Word, CardBase, DragnDrop },
  props: ['header-text', 'btn-text'],
  data() {
    return {
      words: ['zoo', 'time', 'acrobat', 'chance', 'tinker'],
      open: false,
      state: 0
    }
  },
  computed: {
    headertxt: function() {
      switch (this.state) {
        case 0:
          return 'Make your mark!'
        case 1:
          return 'Pick your seed...'
        case 2:
          return 'Build you poem...'
      }
    }
  },
  methods: {
    btnClick() {
      if (this.state === 0) {
        this.open = true
        this.state = 1
      } else {
        this.open = false
        this.state = 0
      }
      console.log(this.state)
    },
    expandCard() {},
    collapse() {
      let el = this.$refs.collapseContent
      if (!this.open) {
        this.open = true

        let maxHeight = el.firstElementChild.scrollHeight
        el.setAttribute('style', `max-height: ${maxHeight}px`)
      } else {
        this.headerText = 'Make your mark!'

        el.removeAttribute('style')
      }
    },
    wordSelected(word) {
      this.state = 2
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
        display: grid
        width: 50px
      transition: all 320ms ease
      display: grid
      grid-template-columns: auto 1fr
      align-items: center
      cursor: pointer

    .open.btn-add
      transform: rotate(45deg)
    p
      margin-left: 15px
  .words
    .word-box
      display: flex
      justify-content: space-evenly

</style>
