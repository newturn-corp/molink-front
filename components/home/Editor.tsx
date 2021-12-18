import { observer } from 'mobx-react'
import '../../utils/prism'
import Prism from 'prismjs'
import React, { useCallback, useEffect, useMemo } from 'react'
import { Editable, withReact, Slate } from 'slate-react'
import {
    createEditor,
    Editor as SlateEditor,
    Text,
    Transforms
} from 'slate'
import { withHistory } from 'slate-history'
import ContentManager from '../../manager/home/ContentManager'
import { BlockComponent, BlockNoLeafComponent } from '../BlockComponent'
import { withImages } from '../../utils/slate/withImages'
import { withShortcuts } from '../../utils/slate/withShortcuts'
import { withLayout } from '../../utils/slate/withLayout'
import HotKeyManager from '../../manager/home/HotKeyManager'
import { withMentions } from '../../utils/slate/withMentions'
import { MentionListComponent } from './MentionListComponent'
import { CommandListComponent } from './CommandListComponent'
import MentionManager from '../../manager/home/MentionManager'
import CommandManager from '../../manager/home/CommandManager'
import { withHeadNextNormalText } from '../../utils/slate/withHeadNextNormalText'
import { HeadNextNormalTextPlugin } from '../../plugin/HeaderWithNormalTextPlugin'

const plugins = [withReact, withShortcuts, withHistory, withImages, withShortcuts, withLayout, withMentions, HeadNextNormalTextPlugin]
const setPlugin = (editor: SlateEditor): SlateEditor => {
    return plugins.reduce((prev, current) => {
        return current(prev)
    }, editor)
}

export const Editor: React.FC<{
  }> = observer(() => {
      const renderElement = useCallback(props => <BlockComponent {...props} />, [])
      const renderLeaf = useCallback(props => <BlockNoLeafComponent {...props} />, [])
      const editor = useMemo(() => setPlugin(createEditor()), [])

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

      useEffect(() => {
          ContentManager.editor = editor
      }, [])
      if (!ContentManager.openedDocument) {
          return <></>
      }
      return <Slate editor={editor} value={[]} onChange={value => {
          if (ContentManager.openedDocument) {
              ContentManager.openedDocument.content = value
          }
          MentionManager.onChange(editor)
          CommandManager.onChange(editor)
      }}>
          <Editable
              decorate={decorate}
              renderElement={renderElement}
              renderLeaf={renderLeaf}
              //   placeholder="Enter some rich text…"
              spellCheck
              autoFocus
              onKeyDown={(e) => {
                  HotKeyManager.handleKeyDown(editor, e)
                  MentionManager.onKeyDown(e, editor)
                  CommandManager.onKeyDown(e, editor)
              }}
              onPaste={(e) => {
                  console.log(e.clipboardData.getData('Text'))
              }}
          />
          <MentionListComponent editor={editor} />
          <CommandListComponent editor={editor} />
      </Slate>
  })
