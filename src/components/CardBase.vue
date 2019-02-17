<template>
  <div class="card-comp">
    <div class="section card-head" >
      <slot name="header"/>
    </div>
    <div class="section card-cont">
      <slot/>
    </div>
    <div class="section card-foot">
      <slot name="footer"/>
    </div>
  </div>
</template>
<script>
export default {
  name: 'CardBase'
}
</script>
<style lang="sass">
    .card-comp
        height: min-content
        text-align: center
        font-size: 4vw
        border: solid 1px
        .card-head
          display: flex
          padding: 3vh 50px
          font-size: 5vw
          align-items: center

        .card-cont
            p
                text-align: center
</style>
