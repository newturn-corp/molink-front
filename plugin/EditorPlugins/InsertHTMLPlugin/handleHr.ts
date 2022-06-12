import { jsx } from 'slate-hyperscript'
import { DividerType } from '../../../Types/slate/CustomElement'

export const handleHr = (el: HTMLElement, children: any) => {
    return jsx('element',
        ({ type: 'divider', dividerType: DividerType.LongLine }),
        children
    )
}
