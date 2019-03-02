//
// store/scroll.js

export const state = () => ({
    el: null,
    active: false,
    point: 0,
    update: 0,
    scrollTo: 0,
    direction: 1,
    vertical: true,
    size: { w: 0, h: 0 }
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
        state.size.w = size.w;
        state.size.h = size.h;
    },
    updateScroll() {
        state.update = !state.update;
    }
};
