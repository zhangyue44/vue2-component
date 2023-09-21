import Vue from "vue";
import Vuex from "vuex";
import moduleA from "./moduleA.js";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    count: 0,
    total: 1,
    todos: [
      { id: 1, text: "...", done: true },
      { id: 2, text: "...", done: false },
    ],
  },
  getters: {
    doneTodos(state, getters) {
      return state.todos.filter((todo) => todo.done);
    },
  },
  mutations: {
    increment(state, payload) {
      state.count++;
      state.total += 2;
      state.todos.unshift({ id: 3, text: "...", done: true });
    },
  },
  actions: {
    increment(context) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          context.commit("increment");
          resolve();
        }, 2000);
      });
    },
  },
  modules: {
    moduleA,
  },
});
