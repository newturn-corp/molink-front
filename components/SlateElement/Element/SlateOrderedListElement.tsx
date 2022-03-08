import React from 'react'
import {
    useSelected,
    useFocused
} from 'slate-react'
import { DividerElement, DividerType, OrderedListElement } from '../../../Types/slate/CustomElement'

export const SlateOrderedListElement: React.FC<{
    attributes,
    children,
    element: OrderedListElement
}> = ({ attributes, children, element }) => {
    return (
        <ol
            start={element.data && element.data.start}
            {...attributes}
        >{children}</ol>
    )
}
