const moduleA = {
  namespaced: true, // 命名空间
  state: () => ({
    count: 0,
  }),
  getters: {
    sumWithRootCount(state, getters, rootState) {
      return state.count + rootState.count;
    },
  },
  mutations: {
    increment(state) {
      state.count++;
    },
  },
  actions: {
    incrementIfOddOnRootSum({ state, commit, rootState }) {
      if ((state.count + rootState.count) % 2 === 1) {
        commit("increment");
      }
    },
  },
};

export default moduleA;
