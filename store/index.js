//
// store/index.js

export const state = () => ({
    counter: 1,
    content: {},
    loaded: false
})

export const mutations = {
    setData( state, data ) {
        state.content = data;
        state.loaded = true;
    },
    increment(state) {
        state.counter++;
    },
    reset(state) {
        state.counter = 1;
    }
}

export const actions = {
    async setContent({ commit, rootState }) {
        commit('setData', await this.$axios.$get(`${ process.env.baseUrl }/data/content/${ rootState.lang.locale }.json`))
    }
}
