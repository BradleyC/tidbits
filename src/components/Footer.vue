<template>
  <footer>
    <!--Saved for reference <span>Created with ♥ by <a href="https://gitlab.com/TrevorJTClarke">@trevorjtclarke</a>, <a href="https://gitlab.com/TrevorJTClarke/truffle-demo-dapp">Fork this Repo!</a></span>-->
    <router-link tag="button" class="btn" to="/">
      <span class="footer-link">Home</span>
    </router-link>|
    <router-link tag="button" class="btn" to="/team">
      <span class="footer-link">Team Page</span>
    </router-link>
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
  align-items: center;
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 20px 0;
  text-align: center;

  button,
  span {
    // margin: auto;
  }
  .footer-link {
    cursor: pointer;
  }
}
</style>
