//
// config/build.js

module.exports = {
    ignore: [],
    plugins: [
        {
            src: "~/plugins/i18n.js",
            ssr: true
        },
        {
            src: "~/plugins/Store.js",
            ssr: false
        },
        {
            src: "~/assets/js/controllers/Scroll.js",
            ssr: false
        }
    ],
    vendor: [
        "gsap"
    ]
}
