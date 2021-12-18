import { observer } from 'mobx-react'
import '../../utils/prism'
import Prism from 'prismjs'
import React, { useCallback, useMemo } from 'react'
import { Editable, withReact, Slate } from 'slate-react'
import {
    createEditor,
    Text
} from 'slate'
import { withHistory } from 'slate-history'
import ContentManager from '../../manager/ContentManager'
import { BlockComponent, BlockNoLeafComponent } from '../BlockComponent'
import { withImages } from '../../utils/slate/withImages'
import { withShortcuts } from '../../utils/slate/withShortcuts'
import { withLayout } from '../../utils/slate/withLayout'
import HotKeyManager from '../../manager/home/HotKeyManager'
import { withMentions } from '../../utils/slate/withMentions'
import { CommandView } from './CommandView'
import MentionManager from '../../manager/home/MentionManager'

export const Editor: React.FC<{
  }> = observer(() => {
      const renderElement = useCallback(props => <BlockComponent {...props} />, [])
      const renderLeaf = useCallback(props => <BlockNoLeafComponent {...props} />, [])
      const editor = useMemo(() => withMentions(withLayout(withShortcuts(withImages(withHistory(withShortcuts(withReact(createEditor()))))))), [])

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
      if (!ContentManager.openedDocument) {
          return <></>
      }

      return <Slate editor={editor} value={ContentManager.openedDocument.content} onChange={value => {
          ContentManager.openedDocument.content = value
          console.log('onchange')
          MentionManager.onChange(editor)
      }}>
          <Editable
              decorate={decorate}
              renderElement={renderElement}
              renderLeaf={renderLeaf}
              //   placeholder="Enter some rich text…"
              spellCheck
              autoFocus
              onKeyDown={(e) => {
                  console.log('onkeydown')
                  HotKeyManager.handleKeyDown(editor, e)
                  MentionManager.onKeyDown(e, editor)
              }}
              onPaste={(e) => {
                  console.log(e.clipboardData.getData('Text'))
              }}
          />
          <CommandView editor={editor} />
      </Slate>
  })
