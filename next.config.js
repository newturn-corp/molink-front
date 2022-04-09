/* eslint-disable no-param-reassign */

const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')

module.exports = (phase, { defaultConfig }) => {
    defaultConfig.env = {
        IS_DEV: phase === PHASE_DEVELOPMENT_SERVER,
        SERVER_BASE_URL: process.env.SERVER_BASE_URL,
        FRONT_HOST_NAME: process.env.FRONT_HOST_NAME,
        TZ: 'Asia/Seoul',
        CONTENT_SERVER_URL: process.env.CONTENT_SERVER_URL,
        HIERARCHY_LIVE_SERVER_URL: process.env.HIERARCHY_LIVE_SERVER_URL,
        USER_SERVER_URL: process.env.USER_SERVER_URL,
        FILE_API_KEY: process.env.FILE_API_KEY
    }
    defaultConfig.future = { webpack5: true }
    defaultConfig.swcMinify = true
    defaultConfig.webpack = config => {
        // 아래를 추가합니다.
        config.module.rules.push({
            test: /\.svg$/i,
            issuer: /\.[jt]sx?$/,
            use: ['@svgr/webpack']
        })
        return config
    }
    return defaultConfig
}
