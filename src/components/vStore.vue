<template>
  <div>
    <div>{{ count }}</div>
    <div>{{ total }}</div>
    <div>{{ doneTodos[0].id }}</div>
    <button @click="add">点击</button>
    <div><button @click="addAction">点击action</button></div>
    <div><button @click="addModuleA">点击moduleA</button></div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";

export default {
  computed: {
    count() {
      return this.$store.state.count;
    },
    ...mapState({
      total: "total",
    }),
    ...mapGetters({
      doneTodos: "doneTodos",
    }),
  },
  methods: {
    add() {
      // this.$store.commit('increment', { age: 18 });
      this.increment({ age: 18 });
    },
    addAction() {
      // this.$store.dispatch('increment', {
      //   amount: 10,
      // }).then(res => console.log(res))
      this.addA({ amount: 10 });
    },
    addModuleA() {
      this.aaa();
    },
    ...mapMutations(["increment"]),
    ...mapActions({
      addA: "increment",
    }),
    ...mapMutations({
      aaa: "moduleA/increment",
    }),
  },
};
</script>

<style lang="scss" scoped></style>
