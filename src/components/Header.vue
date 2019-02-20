<template>
  <div class="header">
    <div />
    <div class="logo">
      <h2 class="app-name">tidbits</h2>
    </div>
    <div class="address">

      <!--<div class="blockie">-->
      <!--<div :class="g0"/>-->
      <!--<div :class="g1"/>-->
      <!--<div :class="g2"/>-->
      <!--<div :class="g3"/>-->
      <!--<div :class="g4"/>-->
      <!--<div :class="g5"/>-->
      <!--<div :class="g6"/>-->
      <!--</div>-->
      <span v-if="account">{{ profile.email }}</span>
      <div v-if="account && balance" class="money-pill money-pill-div">
        <img src="../assets/1F4DC.svg">{{ balance }}
      </div>
      <button v-if="account && !balance"
              class="btn money-pill"
              @click="claim">
        <img src="../assets/1F4DC.svg">CLAIM 500 TOKENS
      </button>
      <div v-if="!profile.email" id="google-signin-hook" />

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
    ...mapGetters(['account', 'profile', 'balance'])
  },
  methods: {
    ...mapActions(['handleLogin', 'issueNewUserTokens']),
    onSignIn(googleUser) {
      this.handleLogin(googleUser).catch(error => {
        console.log(error)
        console.log('account', this.account)
        console.log('email', this.profile.email)
      })
    },
    async claim() {
      await this.issueNewUserTokens()
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
    .blockie {
      display: grid;
      grid-template-rows: 5px 5px;
      grid-template-columns: 5px 5px;
      padding-right: 10px;
    }

    span {
      color: $color1;
      margin: auto 10px;
      font-size: 8pt;
    }
  }
  #google-signin-hook {
    padding-right: 10px;
  }
  .money-pill {
    align-items: center;
    background: orange;
    border-radius: 5px;
    box-shadow: 0 2px 1px -1px rgba(0, 0, 0, 0.2),
      0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 1px 3px 0 rgba(0, 0, 0, 0.12);
    display: flex;
    flex-direction: row;
    height: 30px;
    padding: 0 10px;
    img {
      height: 100%;
      width: 20px;
    }
  }
  .money-pill-div {
    margin-right: 10px;
  }
}
</style>
