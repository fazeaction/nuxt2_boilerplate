//
// store/images.js

export const state = () => ({
    loaded: {}
})

export const mutations = {
    pushImage( state, { key, image }) {
        state.loaded[ key ] = image;
    }
}
