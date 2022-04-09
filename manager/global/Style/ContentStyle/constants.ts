import { isBrowser } from 'react-device-detect'
import { VisibilityMenuStyleInterface } from './interface'

export const defaultContentContainerStyle = {
    transform: isBrowser ? 'translateX(240px)' : undefined,
    width: 1000
}

export const defaultContentBodyStyle = {
    width: 1000,
    top: 106,
    height: 800
}

export const defaultContentMainStyle = {
    marginLeft: 800,
    width: 800
}

export const defaultContentToolbarStyle = {
    height: 89,
    top: 0,
    padding: 8
}

export const defaultContentHeaderStyle = {
    height: 40,
    top: defaultContentToolbarStyle.height
}

export const closeStateContentToolbarStyle = {
    height: 32,
    top: 0,
    padding: 0
}

export const defaultToolbarOnOffButtonStyle = {
    width: 26,
    height: 26,
    top: 60
}

export const closeStateToolbarOnOffButtonStyle = {
    width: 24,
    height: 24,
    top: 5
}

export const defaultVisibilityMenuStyle: VisibilityMenuStyleInterface = {
    top: 112,
    right: 20
}
