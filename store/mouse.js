//
// store/mouse.js

export const state = () => ({
    position: { x: 0, y: 0 },
    normalizedPosition: { x: 0, y: 0 }
})

export const mutations = {

    setMousePosition(state, { x, y, px, py }) {
        state.position = { x, y };
        state.normalizedPosition = { px, py };
    }

}

export const actions = {

    updateMousePosition({ commit, rootState }, e ){
        commit("setMousePosition", {
            x: e.clientX,
            y: e.clientY ,
            px: ( e.clientX / rootState.device.viewportSize.w ).toFixed(2),
            py: ( e.clientY / rootState.device.viewportSize.h ).toFixed(2)
        });
    }
}
