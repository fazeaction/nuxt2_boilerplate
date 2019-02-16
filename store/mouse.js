//
// store/mouse.js

export const state = () => ({
    handler: null,
    position: { x: 0, y: 0 },
    normalizedPosition: { x: 0, y: 0 },
    _DEBOUNCE_DELAY: 15
})

export const mutations = {

    setOnMouseMovement(state, fc){
        state.handler = fc;
    },

    setMousePosition(state, { x, y, px, py }) {
        state.position = { x, y };
        state.normalizedPosition = { px, py };
    },
}

export const actions = {

    init({ commit, dispatch }) {
        commit("setOnMouseMovement",
            dispatch("moving", { clientX: 0, clientY: 0 })
        );
        dispatch("startWatching");
    },

    startWatching({ state }){
        window.addEventListener("mousemove", state.handler, { passive: true });
    },

    moving({ commit, rootState }, e){
        commit("setMousePosition", {
            x: e.clientX,
            y: e.clientY ,
            px: (e.clientX/rootState.device.viewportSize.w).toFixed(2),
            py: (e.clientY/rootState.device.viewportSize.h).toFixed(2)
        });
    }
}
