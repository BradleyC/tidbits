<template>
  <div class="container">
    <div class="display-box">
      <h2>Dappministration</h2>
      <h4>Your contracts</h4>
      <div class="contracts">
        <div v-for="contract in contracts" class="contract-row">
          <div>{{ contract.name }}</div>
          <div>
            <input type="number">
          </div>
          <div>
            <button class="btn btn-info">Top Up</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Dappmin',
  data() {
    return {
      contracts: [{ name: 'Tidbits' }]
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../scss/variables.scss';

.display-box {
  background: $white;
  border-radius: $border-radius;
  box-shadow: 0 1px 7px -2px rgba(0, 0, 0, 0.3);
  padding: 20px;
  width: 80vw;
  min-width: 300px;
  margin: auto;
}

.contract-row {
  align-items: center;
  display: flex;
  justify-content: space-between;
}
</style>
