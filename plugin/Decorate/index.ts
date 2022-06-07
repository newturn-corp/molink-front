import { decorateCode } from './Code'

const decorationList = [decorateCode]

export const decorate = ([node, path]) => {
    return decorationList.reduce((prev, func) => {
        return func(node, path, prev)
    }, [])
}
