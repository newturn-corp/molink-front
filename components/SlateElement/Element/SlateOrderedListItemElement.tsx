import React, { useCallback, useState } from 'react'
import { ReactEditor, useReadOnly, useSlate, useSlateStatic } from 'slate-react'
import { css } from '@emotion/css'
import { Path, Transforms, Node } from 'slate'
import EditorPage from '../../../manager/Blog/Editor/EditorPage'
import { Collapse, List } from '@material-ui/core'

export const SlateOrderedListItemElement: React.FC<{
    attributes,
    children,
    element
}> = ({ attributes, children, element }) => {
    const slateEditor = useSlate()
    const getCurrentNodePath = useCallback(() => (
        ReactEditor.findPath(slateEditor, element)
    ), [slateEditor, element])
    const path = getCurrentNodePath()
    const readOnly = useReadOnly()
    const { checked } = element
    const listIndex = []
    for (let i = 0; i < element.children.length; i++) {
        if (element.children[i].type === 'check-list') {
            listIndex.push(i)
        }
    }
    const listChildren = []
    const otherChildren = []
    for (let i = 0; i < children.length; i++) {
        if (listIndex.includes(i)) {
            listChildren.push(children[i])
        } else {
            otherChildren.push(children[i])
        }
    }

    return (
        <div>
            <div
                {...attributes}
                className={css`
        display: flex;
        flex-direction: row;
        align-items: stretch;

        & + & {
          margin-top: 0;
        }
      `}
            >
                <span
                    contentEditable={false}
                    className={css`
          margin: 0.5em 0.6em 0 0;
          font-size: 1em;
          line-height: 1em;
          user-select: none;
        `}
                >
                    {`${path[path.length - 1] + 1}.`}
                </span>
                <span
                    contentEditable={!readOnly}
                    suppressContentEditableWarning={true}
                    className={css`
          flex: 1;
          opacity: ${checked ? 0.666 : 1};
          text-decoration: ${!checked ? 'none' : 'line-through'};

          &:focus {
            outline: none;
          }
        `}
                >
                    {otherChildren}
                </span>
            </div>
            {listChildren}
        </div>
    )
}
