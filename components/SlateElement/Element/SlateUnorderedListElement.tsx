import React, { useCallback, useEffect } from 'react'
import { OrderedListElement } from '../../../Types/slate/CustomElement'
import { ReactEditor, useSlate } from 'slate-react'
import { Path, Node } from 'slate'

export const SlateUnorderedListElement: React.FC<{
    attributes,
    children,
    element
}> = ({ attributes, children, element }) => {
    // const slateEditor = useSlate()
    // const getParentNode = useCallback(() => (
    //     Node.get(slateEditor, Path.parent(ReactEditor.findPath(slateEditor, element)))
    // ), [slateEditor, element])
    // const parentNode = getParentNode()
    // console.log(parentNode)
    // if (parentNode && parentNode.type === 'list-item' && parentNode.isClosed) {
    //     return <></>
    // }

    return (
        <ul
            className='unordered-list'
            {...attributes}
        >
            {children}
        </ul>
    )
}
