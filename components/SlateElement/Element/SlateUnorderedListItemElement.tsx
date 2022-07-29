import React, { useState } from 'react'
import { ReactEditor, useReadOnly, useSlateStatic } from 'slate-react'
import { css } from '@emotion/css'
import { Transforms } from 'slate'
import EditorPage from '../../../manager/Blog/Editor/EditorPage'
import { Collapse, List } from '@material-ui/core'

export const SlateUnorderedListItemElement: React.FC<{
    attributes,
    children,
    element
}> = ({ attributes, children, element }) => {
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
          margin-right: 0.3em;
          font-size: 1.8em;
          line-height: 1em;
          user-select: none;
        `}
                >
                    {'•'}
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
