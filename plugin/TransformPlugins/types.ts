import { Editor, Location, Node, NodeMatch, Operation } from 'slate'

export type TransformsTransformHandler = (editor: Editor, operation: Operation) => boolean

export type TransformsSetNodeHandler<T extends Node> = (editor: Editor,
    props: Partial<Node>,
    options: {
        at?: Location
        match?: NodeMatch<T>
        mode?: 'all' | 'highest' | 'lowest'
        hanging?: boolean
        split?: boolean
        voids?: boolean
    }) => boolean

export type TransformsSelectHandler = (editor: Editor, location: Location) => boolean
