<template>
  <div id="app">
    <Header />
    <router-view />
    <Footer />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'

export default {
  name: 'App',

  components: {
    Header,
    Footer
  },

  methods: {
    ...mapActions(['connect'])
  },

  mounted() {
    this.connect()
  }
}
</script>

<style lang="scss">
@import './scss/main.scss';

body {
  background: #f9f9f9;
  padding: 0;
  margin: 0;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: $black;
  margin: 0;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>
