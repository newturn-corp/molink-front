import { GlobalBodyStyleInterface, GlobalHeaderStyleInterface } from './interface'
import { isBrowser } from 'react-device-detect'

export const defaultGlobalHeaderStyle: GlobalHeaderStyleInterface = {
    height: isBrowser ? 56 : 44,
    flexDirection: isBrowser ? 'row-reverse' : 'row'
}

export const defaultGlobalBodyStyle: GlobalBodyStyleInterface = {
    top: defaultGlobalHeaderStyle.height,
    height: 1200
}
