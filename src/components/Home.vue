<template>
  <div class="container">
    <CardBtn header-text="Make your mark!" btn-text=""/>
    <div class="lyrics">
      <div v-for="lyric in lyrics" class="box">
        <div class="box-header">
          <span>By: {{ lyric.lyricOwner.substring(0, 16) }}...</span>
        </div>
        <span>{{ lyric.lyricStr }}</span>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import CardBtn from './CardBtn'

export default {
  name: 'Home',
  components: {
    CardBtn
  },
  data() {
    return {
      lyrics: []
    }
  },

  computed: {
    ...mapGetters(['items'])
  },
  async created() {
    this.lyrics = await this.getAllLyrics()
  },
  methods: {
    ...mapActions(['getAllLyrics']),
    getImagePath(item) {
      return `https://storage.googleapis.com/opensea-prod.appspot.com/${
        item.ref
      }/${item.id}.svg`
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../scss/variables.scss';

.container {
}

h2 {
  text-align: center;
}

.btn {
  background: $color2;
  border-radius: $border-radius;
  color: $white;
  min-width: 120px;
}

.box {
  background: $white;
  border-radius: $border-radius;
  box-shadow: 0 1px 7px -2px rgba(0, 0, 0, 0.3);
  padding: 20px;
  width: 30vw;
  min-width: 300px;
  margin: auto;
  margin-top: 10px;

  h3 {
    margin: 0 0 10px;
  }

  .form {
    display: flex;
    flex-direction: column;
  }

  input {
    margin: 0 0 10px;
  }

  .btn {
    margin: auto 0 auto auto;
  }
}
.box-header {
  background: $color2;
}

.list {
  display: flex;
  flex-wrap: wrap;
  margin: 20px auto;
  min-width: 300px;
}

.list-item {
  background: $white;
  border-radius: $border-radius;
  box-shadow: 0 1px 7px -2px rgba(0, 0, 0, 0.3);
  padding: 10px;
  width: 18vw;
  margin: 0 10px 10px;
  max-width: 500px;
  min-width: 80px;
}

.copy {
  h4 {
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin: 0 0 5px;
  }
}
</style>
