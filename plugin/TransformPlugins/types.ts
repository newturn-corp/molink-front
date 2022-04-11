import { Editor, Location, Node, NodeMatch, Operation } from 'slate'

export type TransformsTransformHandler = (editor: Editor, operation: Operation) => boolean

export type TransformsRemoveNodesHandler<T extends Node> = (
    editor: Editor,
    options: {
        at?: Location
        match?: NodeMatch<T>
        mode?: 'highest' | 'lowest'
        hanging?: boolean
        voids?: boolean
    }) => boolean

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

export type TransformsSplitNodeHandler = <T extends Node>(
    editor: Editor,
    options: {
            at?: Location
            match?: NodeMatch<T>
            mode?: 'highest' | 'lowest'
            always?: boolean
            height?: number
            voids?: boolean
    }
) => boolean
