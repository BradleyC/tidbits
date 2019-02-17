<template>
  <div class="drag-n-drop">
    <!--<div class="field" @drop="drop($event)" @dragover="allowDrop($event)"/>-->
    <div class="field">
      <Word v-for="word in poem" :key="word" :word="word" @word-sel="moveWord($event)"/>
    </div>
    <div class="word-list">
      <Word v-for="word in words" :key="word" :word="word" @word-sel="moveWord($event)"/>
    </div>
    <div class="save" :class="toggleActive()">Save</div>
  </div>
</template>

<script>
import Word from './Word'
export default {
  name: 'DragnDrop',
  components: {
    Word
  },
  data() {
    return {
      poem: [],
      words: [
        'random',
        'places',
        'trout',
        'camera',
        'gouge',
        'poodle',
        'satchel',
        'tonight',
        'thoughtless',
        'vacuum'
      ],
      poemMaxLength: 5
    }
  },
  methods: {
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
      } else if (this.poem.length < 5) {
        this.addWord(this.poem, word)
        this.removeWord(this.words, word)
      }
    },
    addWord(array, word) {
      array.push(word)
    },
    removeWord(array, word) {
      let index = array.indexOf(word)
      if (index > -1) {
        array.splice(index, 1)
      }
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
    .inactive
        color: lightgrey
</style>
