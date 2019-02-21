<template>
  <div class="drag-n-drop">
    <!--<div class="field" @drop="drop($event)" @dragover="allowDrop($event)"/>-->
    <div class="field">
      <Word v-for="word in poem" :key="word" :word="word" @word-sel="moveWord($event)"/>
    </div>
    <div class="word-list">
      <Word v-for="word in words" :key="word" :word="word" @word-sel="moveWord($event)"/>
    </div>
    <div class="button-div">
      <button class="btn money-pill" :disabled="disable()" :class="toggleActive()" @click="saveLyric">
        Save Lyric <img src="../assets/1F4DC.svg">5
      </button>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { genWords } from '../utils'
import Word from './Word'
export default {
  name: 'DragnDrop',
  components: {
    Word
  },
  props: {
    seedWord: {
      type: String,
      default() {
        return ''
      }
    }
  },
  data() {
    return {
      poem: [],
      words: [],
      poemMaxLength: 5
    }
  },
  created() {
    this.words = genWords(24)
    // this.words.unshift(this.seedWord)
    this.poem.push(this.seedWord)
  },
  methods: {
    ...mapActions(['createLyric']),
    allowDrop(ev) {
      ev.preventDefault()
    },
    drop(ev) {
      ev.preventDefault()
      let data = ev.dataTransfer.getData('text')
      console.log('data --> ' + data)
      ev.target.appendChild(document.getElementById(data))
      console.log('ev.target --> ' + ev.target)
    },
    disable() {
      return this.poem.length !== this.poemMaxLength
    },
    toggleActive() {
      return {
        inactive: this.poem.length < this.poemMaxLength,
        active: this.poem.length === this.poemMaxLength
      }
    },
    moveWord(word) {
      if (this.poem.indexOf(word) > -1) {
        this.addWord(this.words, word)
        this.removeWord(this.poem, word)
      } else if (this.poem.length < this.poemMaxLength) {
        this.addWord(this.poem, word)
        this.removeWord(this.words, word)
      }
      // clear out original object without replacing reference for parent component?
      for (var i = 0; i < this.poemObj.length; i++) this.poemObj.pop()
      for (var j = 0; j < this.poem.length; j++) this.poemObj.push(this.poem[j])
    },
    addWord(array, word) {
      array.push(word)
    },
    removeWord(array, word) {
      let index = array.indexOf(word)
      if (index > -1) {
        array.splice(index, 1)
      }
    },
    async saveLyric() {
      var createErr
      await this.createLyric({
        content: this.poem
      }).catch(error => {
        console.log(error)
        createErr = true
        alert(error)
      })
      if (createErr) return
      // Blunt force refresh for now to show new poem
      this.$router.go()
    }
  }
}
</script>

<style lang="sass" scoped>
.drag-n-drop
    display: grid
    grid-template-rows: 1fr 1fr
    .field
        height: 20vh
        display: flex
        justify-content: center
        align-items: center
        flex-flow: row wrap
    .word-list
        display: flex
        justify-content: center
        align-items: center
        flex-flow: row wrap
    .save
        text-align: right
        margin-right: 20px
    .active
        color: black
        cursor: pointer
    .button-div
        display: flex
        justify-content: flex-end
    .money-pill
        align-items: center
        background-color: orange
        box-shadow: 0 2px 1px -1px rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 1px 3px 0 rgba(0,0,0,.12)
        border-radius: 5px
        color: white
        cursor: pointer
        display: flex
        height: 50px
        justify-content: center
        transition: all 320ms ease
        img
          height: 100%
          width: 30px
    .inactive
        background: lightgrey
        color: grey
        cursor: unset
</style>
