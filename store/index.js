//
// store/index.js

export const state = ()=>({
    counter: 1,
    content: {}
});

export const mutations = {
    increment(state) {
        state.counter++;
    },
    reset(state) {
        state.counter = 1;
    },
    setContent(state, content) {
        state.content = content;
    }
};

export const actions = {
    async nuxtServerInit({commit}, {route}) {
        //
        // Set data
        const lang = route.fullPath.split("/")[1];
        const data = await this.$axios.$get(`./data/content/${lang}.json`, {crossdomain: true});
        commit("setContent", data);
    }
};
