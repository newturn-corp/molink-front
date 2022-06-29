/* eslint-disable no-param-reassign */
const { withSentryConfig } = require('@sentry/nextjs')

const moduleExports = {
    env: {
        SERVER_BASE_URL: process.env.SERVER_BASE_URL,
        FRONT_HOST_NAME: process.env.FRONT_HOST_NAME,
        TZ: 'Asia/Seoul',
        CONTENT_SERVER_URL: process.env.CONTENT_SERVER_URL,
        HIERARCHY_LIVE_SERVER_URL: process.env.HIERARCHY_LIVE_SERVER_URL,
        USER_SERVER_URL: process.env.USER_SERVER_URL,
        FILE_API_KEY: process.env.FILE_API_KEY
    },
    future: {
        webpack5: true
    },
    images: {
        domains: [process.env.NODE_ENV === 'production' ? 'api.molink.life' : 'api.development.molink.life']
    },
    swcMinify: false,
    webpack: config => {
        // 아래를 추가합니다.
        config.module.rules.push({
            test: /\.svg$/i,
            issuer: /\.[jt]sx?$/,
            use: ['@svgr/webpack']
        })
        return config
    }
}

const sentryWebpackPluginOptions = {
    // Additional config options for the Sentry Webpack plugin. Keep in mind that
    // the following options are set automatically, and overriding them is not
    // recommended:
    //   release, url, org, project, authToken, configFile, stripPrefix,
    //   urlPrefix, include, ignore

    silent: true // Suppresses all logs
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options.
}

module.exports = withSentryConfig(moduleExports, sentryWebpackPluginOptions)
