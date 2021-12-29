import { observer } from 'mobx-react'
import '../../utils/prism'
import Prism from 'prismjs'
import React, { useCallback, useEffect, useMemo } from 'react'
import { Editable, Slate, withReact } from 'slate-react'
import {
    Editor as SlateEditor,
    Text,
    createEditor,
    Transforms,
    Editor,
    Range
} from 'slate'
import { withHistory } from 'slate-history'
import { isKeyHotkey } from 'is-hotkey'

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
import { HoveringToolbar } from '../home/HoveringToolbar'
import { HoveringToolbarPlugin } from '../../plugin/HoveringToolbarPlugin'
import InlinePlugin from '../../plugin/InlinePlugin'

const [
    withEditList,
    onEditListKeyDown
] = EditListPlugin({})

const plugins = [
    withReact,
    withShortcuts,
    withHistory,
    withImages,
    withShortcuts,
    withLayout,
    withMentions,
    HeadNextNormalTextPlugin,
    withEditList,
    withCorrectVoidBehavior,
    HoveringToolbarPlugin,
    InlinePlugin
]

const setPlugin = (editor: SlateEditor): SlateEditor => {
    return plugins.reduce((prev, current) => {
        return current(prev)
    }, editor)
}

const isFormatActive = (editor, format) => {
    const [match] = Editor.nodes(editor, {
        match: n => n[format] === true,
        mode: 'all'
    })
    return !!match
}

const toggleFormat = (editor, format) => {
    const isActive = isFormatActive(editor, format)
    Transforms.setNodes(
        editor,
        { [format]: isActive ? null : true },
        { match: Text.isText, split: true }
    )
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

      const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = event => {
          const { selection } = editor

          // Default left/right behavior is unit:'character'.
          // This fails to distinguish between two cursor positions, such as
          // <inline>foo<cursor/></inline> vs <inline>foo</inline><cursor/>.
          // Here we modify the behavior to unit:'offset'.
          // This lets the user step into and out of the inline without stepping over characters.
          // You may wish to customize this further to only use unit:'offset' in specific cases.
          if (selection && Range.isCollapsed(selection)) {
              const { nativeEvent } = event
              if (isKeyHotkey('left', nativeEvent)) {
                  event.preventDefault()
                  Transforms.move(editor, { unit: 'offset', reverse: true })
                  return
              }
              if (isKeyHotkey('right', nativeEvent)) {
                  event.preventDefault()
                  Transforms.move(editor, { unit: 'offset' })
              }
          }
      }

      if (!ContentManager.openedDocument) {
          return <></>
      }

      return <Slate editor={editor} value={[]} onChange={value => {
          if (!ContentManager.openedDocument || !ContentManager.openedDocument.authority.editable) {
              return
          }
          ContentManager.openedDocument.content = value
          MentionManager.onChange(editor)
          CommandManager.onChange(editor)
          SaveManager.handleOnChange()
      }}>
          <HoveringToolbar/>
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
                  onEditListKeyDown(editor)(e)
                  onKeyDown(e)
              }}
              onDOMBeforeInput={(event: InputEvent) => {
                  switch (event.inputType) {
                  case 'formatBold':
                      event.preventDefault()
                      return toggleFormat(editor, 'bold')
                  case 'formatItalic':
                      event.preventDefault()
                      return toggleFormat(editor, 'italic')
                  case 'formatUnderline':
                      event.preventDefault()
                      return toggleFormat(editor, 'underlined')
                  }
              }}
          />
          <MentionListComponent editor={editor} />
          <CommandListComponent editor={editor} />
      </Slate>
  })
