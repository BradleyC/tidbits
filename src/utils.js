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
export function intToWords(lyricInt) {
  var words = []
  var currentIndex, currentSubstring
  for (var i = 5; i > 0; i--) {
    currentIndex = lyricInt.length - 4 > 0 ? lyricInt.length - 4 : 0
    currentSubstring = lyricInt.substring(currentIndex)
    words.push(wordlist[Number(currentSubstring)])
    lyricInt = lyricInt.substring(0, currentIndex)
  }
  return words.reverse().join(' ')
}
