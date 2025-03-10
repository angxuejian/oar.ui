<template>

  <RouterLink to="/button">button</RouterLink>

  <br>
  <RouterLink to="/input">input</RouterLink>

  <div class="main">
    <RouterView />
  </div>
</template>


<style lang="scss" scoped>

.main {
  // display: flex;
  // align-items: center;
  // justify-content: center;
  margin: 0 auto;
  height: 50vh;
  // background-color: antiquewhite;
  text-align: center;
}


</style>
