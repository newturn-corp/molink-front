import { observer } from 'mobx-react'
import '../../utils/prism'
import Prism from 'prismjs'
import React, { useCallback, useEffect, useMemo } from 'react'
import { Editable, Slate, withReact } from 'slate-react'
import {
    Editor as SlateEditor,
    Text,
    createEditor
} from 'slate'
import { withHistory } from 'slate-history'

import { CustomElementComponent } from '../SlateElement/CustomElementComponent'
import { CustomLeafComponent } from '../SlateElement/CustomLeafComponent'

import { withImages } from '../../plugin/withImages'
import { withShortcuts } from '../../plugin/withShortcuts'
import { withLayout } from '../../plugin/withLayout'
import { withMentions } from '../../plugin/withMentions'
import { HeadNextNormalTextPlugin } from '../../plugin/HeaderWithNormalTextPlugin'

import { EditListPlugin } from '@productboard/slate-edit-list'
import ContentManager from '../../manager/ContentManager'
import { MentionListComponent } from '../home/MentionListComponent'
import { CommandListComponent } from '../home/CommandListComponent'
import HotKeyManager from '../../manager/HotKeyManager'
import MentionManager from '../../manager/MentionManager'
import CommandManager from '../../manager/CommandManager'
import SaveManager from '../../manager/SaveManager'
import { withCorrectVoidBehavior } from '../../plugin/withCorrectVoidBehavior'

const [
    withEditList,
    onKeyDown
] = EditListPlugin({})

const plugins = [withReact, withShortcuts, withHistory, withImages, withShortcuts, withLayout, withMentions, HeadNextNormalTextPlugin, withEditList, withCorrectVoidBehavior]
const setPlugin = (editor: SlateEditor): SlateEditor => {
    return plugins.reduce((prev, current) => {
        return current(prev)
    }, editor)
}

export const PureEditor: React.FC<{
  }> = observer(() => {
      const renderElement = useCallback(props => <CustomElementComponent {...props} />, [])
      const renderLeaf = useCallback(props => <CustomLeafComponent {...props} />, [])
      const editor = useMemo(() => setPlugin(createEditor()), [])

      useEffect(() => {
          ContentManager.editor = editor
      }, [])

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
      return <Slate editor={editor} value={[]} onChange={value => {
          if (!ContentManager.openedDocument.authority.editable) {
              return
          }
          ContentManager.openedDocument.content = value
          MentionManager.onChange(editor)
          CommandManager.onChange(editor)
          SaveManager.handleOnChange()
      }}>
          <Editable
              decorate={decorate}
              renderElement={renderElement}
              renderLeaf={renderLeaf}
              readOnly={!ContentManager.openedDocument.authority.editable}
              //   placeholder="Enter some rich text…"
              spellCheck={!ContentManager.openedDocument.authority.editable}
              onKeyDown={(e) => {
                  if (!ContentManager.openedDocument.authority.editable) {
                      return
                  }
                  HotKeyManager.handleKeyDown(editor, e)
                  MentionManager.onKeyDown(e, editor)
                  CommandManager.onKeyDown(e, editor)
                  onKeyDown(editor)(e)
              }}
          />
          <MentionListComponent editor={editor} />
          <CommandListComponent editor={editor} />
      </Slate>
  })
