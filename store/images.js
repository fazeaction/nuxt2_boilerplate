//
// store/images.js

export const state = () => ({
    bunch: {}
})

export const mutations = {
    pushImage( state, { key, image }) {
        state.bunch[ key ] = image;
    }
}
