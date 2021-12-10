/* eslint-disable no-param-reassign */

const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')

module.exports = (phase, { defaultConfig }) => {
    defaultConfig.env = {
        IS_DEV: phase === PHASE_DEVELOPMENT_SERVER,
        SERVER_BASE_URL: process.env.SERVER_BASE_URL
    }
    defaultConfig.future = { webpack5: true }
    return defaultConfig
}
