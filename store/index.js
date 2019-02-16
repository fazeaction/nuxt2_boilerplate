//
// store/index.js

export const state = () => ({
    browser: false,
    counter: 1
})

export const mutations = {
    increment(state) {
        state.counter++;
    },
    reset(state) {
        state.counter = 1;
    }
}

export const actions = {
    init ({ commit }) {
        commit("browser");
    }
}
