import { observer } from 'mobx-react'
import React, { useCallback, useEffect } from 'react'
import { Slate, Editable, ReactEditor } from 'slate-react'
import { MentionListComponent } from '../../../Home/Main/Content/MentionListComponent'
import { CommandListComponent } from '../Command/CommandListComponent'
import { CustomElementComponent } from '../../../SlateElement/CustomElementComponent'
import { CustomLeafComponent } from '../../../SlateElement/CustomLeafComponent'
import { HoveringToolbar } from '../../../Home/Main/Content/HoveringToolbar/HoveringToolbar'
import { handleDOMBeforeInput, handleKeyDown } from '../../../../plugin'
import { decorate as decorateFunc } from '../../../../plugin/Decorate'
import { DOMNode } from 'slate-react/dist/utils/dom'
import { Editor } from 'slate'
import { LinkMenuComponent } from '../../../Home/Main/Content/LinkMenuComponent'
import EditorPage from '../../../../manager/Blog/Editor/EditorPage'
import { RemoteCursorOverlay } from './Overlay/Cursor/RemoteCursorOverlay'

export const getDefaultView = (value: any): Window | null => {
    return (
        (value && value.ownerDocument && value.ownerDocument.defaultView) || null
    )
}

const isDOMNode = (value: any): value is DOMNode => {
    const window = getDefaultView(value)
    return !!window && value instanceof window.Node
}

const hasEditableTarget = (
    editor: ReactEditor,
    target: EventTarget | null
): target is DOMNode => {
    return (
        isDOMNode(target) &&
        ReactEditor.hasDOMNode(editor, target, { editable: true })
    )
}

export const IS_EDGE_LEGACY =
    typeof navigator !== 'undefined' &&
    /Edge?\/(?:[0-6][0-9]|[0-7][0-8])/i.test(navigator.userAgent)

export const IS_CHROME_LEGACY =
    typeof navigator !== 'undefined' &&
    /Chrome?\/(?:[0-7][0-5]|[0-6][0-9])/i.test(navigator.userAgent)

const HAS_BEFORE_INPUT_SUPPORT =
    !IS_CHROME_LEGACY &&
    !IS_EDGE_LEGACY &&
    // globalThis is undefined in older browsers
    typeof globalThis !== 'undefined' &&
    globalThis.InputEvent &&
    // @ts-ignore The `getTargetRanges` property isn't recognized.
    typeof globalThis.InputEvent.prototype.getTargetRanges === 'function'

const deleteForward = Editor.deleteForward
Editor.deleteForward = (editor: Editor) => {
    deleteForward(editor)
}

export const EditorComponent: React.FC<{
  }> = observer(() => {
      const editor = EditorPage.editor
      const slateEditor = editor.slateEditor

      const renderElement = useCallback(props => <CustomElementComponent {...props} />, [])
      const renderLeaf = useCallback(props => <CustomLeafComponent {...props} />, [])
      const decorate = useCallback(([node, path]) => decorateFunc([node, path]), [])
      useEffect(() => {
          editor.editableElement = document.getElementById('editable')
      }, [])

      return <Slate editor={slateEditor} value={slateEditor.children} onChange={value => {
      }}>
          <HoveringToolbar/>
          <RemoteCursorOverlay>
              <Editable
                  id={'editable'}
                  className={'editor'}
                  renderElement={renderElement}
                  renderLeaf={renderLeaf}
                  decorate={decorate}
                  readOnly={!editor.editable || editor.info.isLocked}
                  spellCheck={!editor.editable || editor.info.isLocked}
                  suppressContentEditableWarning={true}
                  onKeyDown={(event) => {
                      return handleKeyDown(event, slateEditor)
                  }}
                  onDOMBeforeInput={(event: InputEvent) => {
                      handleDOMBeforeInput(event)
                  }}
              />
          </RemoteCursorOverlay>
          <MentionListComponent editor={slateEditor} />
          <CommandListComponent editor={slateEditor} />
          <LinkMenuComponent/>
      </Slate>
  })
