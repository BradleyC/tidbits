<template>
  <footer>
    <span>Created with ♥ by <a href="https://gitlab.com/TrevorJTClarke">@trevorjtclarke</a>, <a href="https://gitlab.com/TrevorJTClarke/truffle-demo-dapp">Fork this Repo!</a></span>
  </footer>
</template>

<script>
export default {
  name: 'Footer'
}
</script>

<style lang="scss" scoped>
@import '../scss/variables.scss';

footer {
  width: 100%;
  display: flex;
  padding: 20px 0;
  text-align: center;

  span {
    margin: auto;
  }
}
</style>
