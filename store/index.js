//
// store/index.js

export const state = () => ({
    counter: 1,
    header: {},
    footer: {}
})

export const mutations = {
    increment(state) {
        state.counter++;
    },
    reset(state) {
        state.counter = 1;
    },
    setHeader(state, value) {
        state.header = value;
    },
    setFooter(state, value) {
        state.footer = value;
    }
}

export const actions = {
    async nuxtServerInit({ commit, rootState }) {
        //
        // Set static data (non-pages data).
        commit("images/importImages", await this.$axios.$get(`${ process.env.baseUrl }/data/content/images.json`));
        commit("setHeader", await this.$axios.$get(`${ process.env.baseUrl }/data/content/${ rootState.lang.locale }/header.json`));
        commit("setFooter", await this.$axios.$get(`${ process.env.baseUrl }/data/content/${ rootState.lang.locale }/footer.json`));
    }
}
