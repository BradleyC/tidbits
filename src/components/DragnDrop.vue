<template>
  <div class="drag-n-drop">
    <!--<div class="field" @drop="drop($event)" @dragover="allowDrop($event)"/>-->
    <div class="field">
      <Word v-for="word in poem" :key="word" :word="word" @word-sel="moveWord($event)"/>
    </div>
    <div class="word-list">
      <Word v-for="word in words" :key="word" :word="word" @word-sel="moveWord($event)"/>
    </div>
    <button class="btn btn-danger save" :disabled="disable()" :class="toggleActive()" @click="saveLyric">Save</button>
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
    poemObj: {
      type: Array,
      default() {
        return []
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
    this.words = genWords(25)
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
        padding-right: 20px
    .active
        color: black
        cursor: pointer
    .inactive
        color: lightgrey
        cursor: unset
</style>
