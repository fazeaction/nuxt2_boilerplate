//
// store/images.js

import Images from "~/static/data/content/images";

export const state = () => ({
    data: {},
    loaded: {}
})

export const mutations = {
    pushImage( state, { key, image }) {
        state.loaded[ key ] = image;
    },
    importImages( state, images ) {
        state.data = images;
    }
}
