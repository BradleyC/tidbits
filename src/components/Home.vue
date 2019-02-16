<template>
  <div class="container">
    <h2>ImageRegistry</h2>

    <div class="box">
      <h3>Add Asset</h3>
      <div class="form">
        <input type="text" name="ref" v-model="newRef" placeholder="Image Address">
        <input type="text" name="id" v-model="newId" placeholder="Image ID">
        <button class="btn" @click="addAssetItem">Submit</button>
      </div>
    </div>

    <div class="list">
      <div class="list-item" v-for="item in items">
        <div class="asset">
          <img :src="getImagePath(item)">
        </div>
        <div class="copy">
          <h4>Ref: {{ item.ref }}</h4>
          <p>ID: {{ item.id }}</p>
        </div>
        <button class="btn" @click="deleteAsset(item)">Delete</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'Home',

  data() {
    return {
      newRef: '0x06012c8cf97bead5deae237070f9587f8e7a266d',
      newId: 1066650
    }
  },

  computed: {
    ...mapGetters(['items'])
  },

  methods: {
    ...mapActions(['removeAsset', 'addAsset']),
    getImagePath(item) {
      // return `https://img.cryptokitties.co/${item.ref}/${item.id}.svg`
      return `https://storage.googleapis.com/opensea-prod.appspot.com/${
        item.ref
      }/${item.id}.svg`
    },
    deleteAsset(item) {
      this.removeAsset(item)
    },
    addAssetItem() {
      if (!this.newRef || !this.newId) return
      this.addAsset({ ref: this.newRef, id: parseInt(this.newId) })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../scss/variables.scss';

.container {
  margin: 20px auto;
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
