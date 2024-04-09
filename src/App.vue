<template>
  <div id="app" class="w-full h-full">
    <router-view />
  </div>
</template>

<script>
import { EventBus } from "@/EventBus.js";
import chalk from "chalk";

export default {
  created() {
    console.log(chalk.blue("App created"));
  },
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
