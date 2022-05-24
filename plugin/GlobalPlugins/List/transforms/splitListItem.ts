import { Editor, Transforms } from 'slate'
import { ListTransforms } from '../../ListPlugin'

export const splitListItem = (editor: Editor): void =>
    Transforms.splitNodes(editor, {
        match: n => ListTransforms.isItem(n),
        always: true
    })
