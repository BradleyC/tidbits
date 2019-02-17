import wordlist from './assets/wordlist'
export function genWords(n) {
  let i = 0
  let words = []
  while (i < n) {
    let word = wordlist[randomIntInc(0, 2048)]
    if (words.indexOf(word) < 0) {
      words.push(word)
      i++
    }
  }
  return words
}
export function randomIntInc(low, high) {
  return Math.floor(Math.random() * (high - low + 1) + low)
}
export function wordId(word) {
  return wordlist.indexOf(word)
}
