//
// plugins/Checks.js

export default ({ store }) => {

    store.dispatch("setContent");
    store.dispatch("mouse/init");
    store.dispatch("device/init");
}
