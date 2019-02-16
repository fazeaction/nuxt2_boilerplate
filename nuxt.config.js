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
        // Doc: https://axios.nuxtjs.org/usage
        '@nuxtjs/pwa',
        '@nuxtjs/axios',
        '@nuxtjs/style-resources'
    ],

    styleResources: {
        scss: [
            'assets/css/style.scss'
        ]
    },

    css: ["@/assets/css/style.scss"],

    axios: {
        // See https://github.com/nuxt-community/axios-module#options
    },

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
        ],
        extend(config, ctx) {

        }
    },

    generate: {
        dir: process.env.DIR,
        routes: routes,
        fallback: true
    }
}
