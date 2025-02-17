<script setup lang="ts"></script>

<template>
  <RouterView />
</template>

<style lang="scss">
@font-face {
  font-family: 'Nokia Pure Text';
  src: url('./assets/font/NokiaPureText_Rg.eot');
  src: url('./assets/font/NokiaPureText_Rg.eot?#iefix') format('embedded-opentype'),
  url('./assets/font/NokiaPureText_Rg.woff2') format('woff2'),
  url('./assets/font/NokiaPureText_Rg.woff') format('woff'),
  url('./assets/font/NokiaPureText_Rg.svg#NokiaPureText-Regular') format('svg');
  font-weight: normal;
  font-style: normal;
}

body {
  font-family: 'Nokia Pure Text','Noto Sans', 'Arial', sans-serif;

}

</style>
