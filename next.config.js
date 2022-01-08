/* eslint-disable no-param-reassign */

const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')

module.exports = (phase, { defaultConfig }) => {
    defaultConfig.env = {
        IS_DEV: phase === PHASE_DEVELOPMENT_SERVER,
        SERVER_BASE_URL: process.env.SERVER_BASE_URL,
        FRONT_HOST_NAME: process.env.FRONT_HOST_NAME,
        TZ: 'Asia/Seoul',
        CONTENT_SERVER_URL: process.env.CONTENT_SERVER_URL
    }
    defaultConfig.future = { webpack5: true }
    defaultConfig.swcMinify = true
    return defaultConfig
}
