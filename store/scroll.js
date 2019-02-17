//
// store/scroll.js

export const state = () => ({
    el: null,
    active: false,
    point: 0,
    scrollTo: 0,
    direction: 1,
    vertical: true,
    height: 0
});

export const mutations = {
    setActive(state, value) {
        state.active = value;
    },
    setPoint(state, point) {
        state.point = point;
    },
    updateScrollTo(state, point) {
        state.scrollTo = point;
    },
    setDomEl(state, el) {
        state.el = el;
    },
    setDirection(state, direction) {
        state.direction = direction;
    },
    setVertical(state, vertical) {
        state.vertical = vertical;
    },
    setHeight(state, size) {
        state.height = size.h;
    }
};
