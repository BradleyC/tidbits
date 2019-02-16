<template>
  <div class="header">
    <div class="logo">
      <h3>🌌 Demo dApp</h3>
    </div>
    <div class="address">
      <span v-if="acct">Account: {{ acct.substring(0, 16) }}...</span>
      <div v-else id="google-signin-hook" />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Header',

  mounted() {
    window.gapi.signin2.render('google-signin-hook', {
      onsuccess: this.onSignIn
    })
  },
  computed: {
    ...mapGetters(['metamask', 'account']),
    acct() {
      return this.metamask && this.account ? this.account : null
    }
  },
  methods: {
    ...mapActions(['handleLogin']),
    onSignIn(googleUser) {
      this.handleLogin(googleUser).catch(error => {
        console.log(error)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../scss/variables.scss';

.header {
  width: 100%;
  display: flex;
  background: $color2;
  justify-content: space-between;
  padding: 10px 0;

  .logo,
  .address {
    margin: 0 20px;
  }

  .address {
    display: flex;

    span {
      color: $color1;
      margin: auto 10px;
      font-size: 12pt;
    }
  }
}
</style>
