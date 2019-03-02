//
// plugins/Store.js

export default ({ store }) => {

    store.dispatch("setContent");
    store.dispatch("device/init");
}
