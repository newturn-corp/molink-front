import { observer } from 'mobx-react'
import '../utils/prism'
import Prism from 'prismjs'
import React, { useCallback, useMemo } from 'react'
import { Editable, withReact, Slate } from 'slate-react'
import {
    createEditor,
    Range,
    Text,
    Element as SlateElement,
    Editor as SlateEditor,
    Transforms,
    Point
} from 'slate'
import { withHistory } from 'slate-history'
import ContentManager from '../manager/ContentManager'
import { BlockComponent, BlockNoLeafComponent } from './BlockComponent'
import { BulletedListElement } from '../utils/slate'

// modifications and additions to prism library

const SHORTCUTS = {
    '*': 'list-item',
    '-': 'list-item',
    '+': 'list-item',
    '>': 'block-quote',
    '#': 'heading-one',
    '##': 'heading-two',
    '###': 'heading-three',
    '####': 'heading-four',
    '#####': 'heading-five',
    '######': 'heading-six',
    '```': 'code'
}

const withShortcuts = editor => {
    const { deleteBackward, insertText } = editor

    editor.insertText = text => {
        const { selection } = editor

        if (text === '`' && selection && Range.isCollapsed(selection)) {
            const { anchor } = selection
            const block = SlateEditor.above(editor, {
                match: n => SlateEditor.isBlock(editor, n)
            })
            const path = block ? block[1] : []
            const start = SlateEditor.start(editor, path)
            const range = { anchor, focus: start }
            const beforeText = SlateEditor.string(editor, range)
            if (beforeText === '``') {
                Transforms.select(editor, range)
                Transforms.delete(editor)
                const newProperties: Partial<SlateElement> = {
                    type: 'code'
                }
                Transforms.setNodes<SlateElement>(editor, newProperties, {
                    match: n => SlateEditor.isBlock(editor, n)
                })
                return
            }
        }

        if (text === ' ' && selection && Range.isCollapsed(selection)) {
            const { anchor } = selection
            const block = SlateEditor.above(editor, {
                match: n => SlateEditor.isBlock(editor, n)
            })
            const path = block ? block[1] : []
            const start = SlateEditor.start(editor, path)
            const range = { anchor, focus: start }
            const beforeText = SlateEditor.string(editor, range)
            const type = SHORTCUTS[beforeText]

            if (type) {
                Transforms.select(editor, range)
                Transforms.delete(editor)
                const newProperties: Partial<SlateElement> = {
                    type
                }
                Transforms.setNodes<SlateElement>(editor, newProperties, {
                    match: n => SlateEditor.isBlock(editor, n)
                })

                if (type === 'list-item') {
                    const list: BulletedListElement = {
                        type: 'bulleted-list',
                        children: []
                    }
                    Transforms.wrapNodes(editor, list, {
                        match: n =>
                            !SlateEditor.isEditor(n) &&
                SlateElement.isElement(n) &&
                n.type === 'list-item'
                    })
                }

                return
            }
        }

        insertText(text)
    }

    editor.deleteBackward = (...args) => {
        const { selection } = editor

        if (selection && Range.isCollapsed(selection)) {
            const match = SlateEditor.above(editor, {
                match: n => SlateEditor.isBlock(editor, n)
            })

            if (match) {
                const [block, path] = match
                const start = SlateEditor.start(editor, path)

                if (
                    !SlateEditor.isEditor(block) &&
            SlateElement.isElement(block) &&
            block.type !== 'paragraph' &&
            Point.equals(selection.anchor, start)
                ) {
                    const newProperties: Partial<SlateElement> = {
                        type: 'paragraph'
                    }
                    Transforms.setNodes(editor, newProperties)

                    if (block.type === 'list-item') {
                        Transforms.unwrapNodes(editor, {
                            match: n =>
                                !SlateEditor.isEditor(n) &&
                  SlateElement.isElement(n) &&
                  n.type === 'bulleted-list',
                            split: true
                        })
                    }

                    return
                }
            }

            deleteBackward(...args)
        }
    }

    return editor
}

export const Editor: React.FC<{
  }> = observer(() => {
      const renderElement = useCallback(props => <BlockComponent {...props} />, [])
      const renderLeaf = useCallback(props => <BlockNoLeafComponent {...props} />, [])
      const editor = useMemo(() => withHistory(withShortcuts(withReact(createEditor()))), [])
      // decorate function depends on the language selected

      const getLength = token => {
          if (typeof token === 'string') {
              return token.length
          } else if (typeof token.content === 'string') {
              return token.content.length
          } else {
              return token.content.reduce((l, t) => l + getLength(t), 0)
          }
      }

      const decorate = useCallback(
          ([node, path]) => {
              const ranges = []
              if (!Text.isText(node)) {
                  return ranges
              }
              const tokens = Prism.tokenize(node.text, Prism.languages.html)
              let start = 0

              for (const token of tokens) {
                  const length = getLength(token)
                  const end = start + length

                  if (typeof token !== 'string') {
                      ranges.push({
                          [token.type]: true,
                          anchor: { path, offset: start },
                          focus: { path, offset: end }
                      })
                  }

                  start = end
              }

              return ranges
          },
          ['html']
      )
      if (!ContentManager.content) {
          return <></>
      }

      return <div className={'contents'}>
          <Slate editor={editor} value={ContentManager.content} onChange={value => {
              ContentManager.content = value
              ContentManager.handleOnChange()
          }}>
              <Editable
                  decorate={decorate}
                  renderElement={renderElement}
                  renderLeaf={renderLeaf}
                  placeholder="Enter some rich text…"
                  spellCheck
                  autoFocus
                  onKeyDown={(e) => {
                      ContentManager.handleKeyDown(editor, e)
                  }}
                  onPaste={(e) => {
                      console.log(e.clipboardData.getData('Text'))
                  }}
              />
          </Slate>
      </div>
      //   return <></>
  })
