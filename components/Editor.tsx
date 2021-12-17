import { observer } from 'mobx-react'
import '../utils/prism'
import Prism from 'prismjs'
import React, { useCallback, useMemo } from 'react'
import { Editable, withReact, Slate } from 'slate-react'
import {
    createEditor,
    Text
} from 'slate'
import { withHistory } from 'slate-history'
import ContentManager from '../manager/ContentManager'
import { BlockComponent, BlockNoLeafComponent } from './BlockComponent'
import { withImages } from '../utils/slate/withImages'
import { withShortcuts } from '../utils/slate/withShortcuts'
import { withLayout } from '../utils/slate/withLayout'

export const Editor: React.FC<{
  }> = observer(() => {
      const renderElement = useCallback(props => <BlockComponent {...props} />, [])
      const renderLeaf = useCallback(props => <BlockNoLeafComponent {...props} />, [])
      const editor = useMemo(() => withLayout(withShortcuts(withImages(withHistory(withShortcuts(withReact(createEditor())))))), [])

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
          }}>
              <Editable
                  decorate={decorate}
                  renderElement={renderElement}
                  renderLeaf={renderLeaf}
                  //   placeholder="Enter some rich text…"
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
