import React from 'react'
import { ReactEditor, useReadOnly, useSlateStatic } from 'slate-react'
import { css } from '@emotion/css'
import { Transforms } from 'slate'

export const SlateCheckListItemElement: React.FC<{
    attributes,
    children,
    element
  }> = ({ attributes, children, element }) => {
      const editor = useSlateStatic()
      const readOnly = useReadOnly()
      const { checked } = element
      const checkListIndex = []
      for (let i = 0; i < element.children.length; i++) {
          if (element.children[i].type === 'check-list') {
              checkListIndex.push(i)
          }
      }
      const checkListChildren = []
      const otherChildren = []
      for (let i = 0; i < children.length; i++) {
          if (checkListIndex.includes(i)) {
              checkListChildren.push(children[i])
          } else {
              otherChildren.push(children[i])
          }
      }
      console.log(children)
      console.log(element.children)
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
          margin-right: 0.5em;
        `}
                  >
                      <input
                          type="checkbox"
                          style={{
                              marginTop: 9
                          }}
                          checked={checked}
                          onChange={event => {
                              const path = ReactEditor.findPath(editor, element)
                              const newProperties = {
                                  checked: event.target.checked
                              }
                              Transforms.setNodes(editor, newProperties, { at: path })
                          }}
                      />
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
              {checkListChildren}
          </div>
      )
  }
