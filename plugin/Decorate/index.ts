import { decorateCursor } from './Cursor'
import { decorateCode } from './Code'

const decorationList = [decorateCursor, decorateCode]

export const decorate = ([node, path]) => {
    return decorationList.reduce((prev, func) => {
        return func(node, path, prev)
    }, [])
}
