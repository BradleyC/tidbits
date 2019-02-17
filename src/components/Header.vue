<template>
  <div class="header">
    <div />
    <div class="logo">
      <h2 class="app-name">tidbits</h2>
    </div>
    <div class="address">
      <span v-if="account">{{ account }}</span>
      <span v-if="account">Auth'd as:</span>
      <span v-if="account">{{ profile.email }}</span>
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
    ...mapGetters(['account', 'profile'])
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

  .logo {
    display: flex;
    justify-content: space-around;
    width: 100%;
  }
  .app-name {
    font-family: 'Cedarville Cursive', cursive;
    font-size: 2em;
    font-weight: unset;
    margin: unset;
  }
  .logo,
  .address {
    margin: 0 20px;
  }

  .address {
    align-items: flex-end;
    display: flex;
    flex-direction: column;
    margin: unset;
    position: absolute;
    right: 0;

    span {
      color: $color1;
      margin: auto 10px;
      font-size: 8pt;
    }
  }
  #google-signin-hook {
    padding-right: 10px;
  }
}
</style>
