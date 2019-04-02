require('dotenv').config({
    path: './config/env/' + process.env.ENV_FILE
});

const Manifest = require("." + process.env.MANIFEST);
const Config = require("." + process.env.CONFIG);

const routes = [];
Manifest.langs.forEach(lang => {
    Manifest.routes.forEach(route => {
        routes.push(`/${ lang }/${ route }`);
    });
});

module.exports = {

    env: {
        preview: process.env.SPA,
        generate: process.env.GENERATE,
        baseTitle: Manifest.head.baseTitle,
        baseUrl: process.env.PROTOCOL + process.env.SUBDOMAIN + process.env.DOMAIN + process.env.SUBFOLDER,
        CONFIG: process.env.CONFIG,
        MANIFEST: process.env.MANIFEST,
    },

    router: {
        base: process.env.BASE,
    },

    plugins: Config.plugins,

    modules: [
        '@nuxtjs/pwa',
        '@nuxtjs/axios',
        '@nuxtjs/style-resources'
    ],

    styleResources: {
        scss: [
            'assets/css/_abs.scss'
        ]
    },

    css: ["@/assets/css/style.scss"],

    loading: false,

    build: {
        uglify: {
            uglifyOptions: {
                compress: {
                    drop_console: process.env.NODE_ENV === "prod"
                }
            }
        },
        postcss: [
            require("autoprefixer")({
                browsers: ["last 2 versions", "ie >= 9", "Safari 8"],
            })
        ]
    },

    generate: {
        dir: process.env.DIR,
        routes: routes,
        fallback: true
    }
}
