import { isBrowser } from 'react-device-detect'
import {
    HierarchyContainerStyleInterface, HierarchyPageComponentStyleInterface,
    HierarchyPageTitleStyleInterface,
    HierarchyPaperStyleInterface
} from './interfaces'

export const defaultHierarchyOnOffButtonWidth = 26
export const defaultHierarchyWidth = 240

export const defaultWidthControllerStyle = {
    left: 240
}

export const defaultOnOffButtonStyle = {
    left: 240 - defaultHierarchyOnOffButtonWidth * 0.5
}

export const defaultContainerStyle: HierarchyContainerStyleInterface = {
    width: 240,
    top: isBrowser ? 56 : 0,
    height: 1280 - 56,
    zIndex: isBrowser ? 10 : 1000,
    position: isBrowser ? 'fixed' : 'absolute'
}

export const defaultHierarchyPaperStyle: HierarchyPaperStyleInterface = {
    height: 1280 - 56
}

export const defaultHierarchyPageTitleStyle: HierarchyPageTitleStyleInterface = {
    fontSize: isBrowser ? 15 : 16
}

export const defaultHierarchyPageComponentStyle: HierarchyPageComponentStyleInterface = {
    height: isBrowser ? 30 : 40
}
