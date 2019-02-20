<template>
  <CardBase>
    <div v-if="state !== 3" class="header" slot="header">
      <!--<div :class="['btn-add', {'open' : open}]" @click="btnClick"><img src="../assets/plus.svg" alt=""></div>-->
      <div :class="['btn-add', {'open' : open}]" @click="btnClick">
        <img src="../assets/1F4DC.svg">5
      </div>
      <p>{{ headertxt }}</p>
    </div>
    <div v-else />
    <div ref="collapseContent" class="words">
      <div v-if="state === 1" class="word-box">
        <Word v-for="word in words" :key="word" :word="word" @word-sel="wordSelected($event)"/>
      </div>
      <DragnDrop :poem-obj="poemObj" ref="dragNDrop" v-if="state === 2" @poem-finalized="poemFinalized($event)"/>
    </div>
  </CardBase>
</template>
<script>
import { mapActions } from 'vuex'
import CardBase from './CardBase'
import Word from './Word'
import DragnDrop from './DragnDrop'
import { genWords } from '../utils'

export default {
  name: 'CardBtn',
  components: { Word, CardBase, DragnDrop },
  props: ['header-text', 'btn-text'],
  data() {
    return {
      words: ['zoo', 'time', 'acrobat', 'chance', 'tinker'],
      open: false,
      state: 0,
      poemObj: []
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
          return 'Build your poem...'
        case 3:
          return ''
      }
    }
  },
  methods: {
    ...mapActions(['createLyric', 'handleLogin']),
    btnClick() {
      if (this.state === 0) {
        this.open = true
        this.state = 1
        this.words = genWords(5)
      } else {
        this.open = false
        this.state = 0
      }
      console.log(this.state)
    },
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
    poemFinalized() {
      console.log(this.poemObj)
      // this.createLyric({
      //   content: this.words.join(' ')
      // })
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
      transition: all 320ms ease
      display: flex
      align-items: center
      cursor: pointer
      background-color: orange
      color: white
      box-shadow: 0 2px 1px -1px rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 1px 3px 0 rgba(0,0,0,.12)
      border-radius: 5px
      height: 50px
      width: 50px
      justify-content: center
      img
        height: 100%
        width: 30px
    .open.btn-add
      transform: translateY(-10px)
      opacity: 0

    p
      margin-left: 15px
  .words
    .word-box
      display: flex
      justify-content: space-evenly

</style>
