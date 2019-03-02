//
// plugins/Mouse.js

export default ({ store }) => {

    window.addEventListener( "mousemove", e => {
        store.dispatch("mouse/updateMousePosition", e );
    })
}
