<template>
  <div class="container">
    <div class="display-box">
      <h2>AUTHors</h2>
      <ul>
        <li>Bradley Clarke</li>
        <li>Taylor J Dawson</li>
        <li>Gabe Ibarra</li>
      </ul>
      <h2>HELPers</h2>
      <ul>
        <li>Trevor Clarke</li>
      </ul>
      <h2>PROVIDErs</h2>
      <div class="tech-logos">
        <div class="img-container">
          <img src="../assets/ETHEREUM-LOGO_PORTRAIT_Black_small.png">
        </div>
        <div style="width: 30%" class="img-container">
          <img src="../assets/Quorum.png">
        </div>
        <br>
        <br>
        <div class="img-container">
          <img src="../assets/clearmatics.svg">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Team'
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

.tech-logos {
  align-items: center;
  display: flex;
  flex-direction: column;
  margin-top: -100px;
}
.img-container {
  width: 100%;
  img {
    width: 100%;
  }
}
</style>
