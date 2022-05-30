import { observer } from 'mobx-react'
import React, { useCallback, useEffect } from 'react'
import { Slate, Editable, ReactEditor } from 'slate-react'
import { MentionListComponent } from './MentionListComponent'
import { CommandListComponent } from './CommandListComponent'
import { CustomElementComponent } from '../../../SlateElement/CustomElementComponent'
import { CustomLeafComponent } from '../../../SlateElement/CustomLeafComponent'
import { HoveringToolbar } from './HoveringToolbar/HoveringToolbar'
import { handleDOMBeforeInput, handleKeyDown } from '../../../../plugin'
import { decorate as decorateFunc } from '../../../../plugin/Decorate'
import EditorManager from '../../../../manager/Blog/EditorManager'
import { DOMNode } from 'slate-react/dist/utils/dom'
import { Editor } from 'slate'
import { LinkMenuComponent } from './LinkMenuComponent'

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
      const renderElement = useCallback(props => <CustomElementComponent {...props} />, [])
      const renderLeaf = useCallback(props => <CustomLeafComponent {...props} />, [])
      const decorate = useCallback(([node, path]) => decorateFunc([node, path]), [EditorManager.cursors])
      useEffect(() => {
          EditorManager.editableElement = document.getElementById('editable')
      }, [])

      return <Slate editor={EditorManager.slateEditor} value={[]} onChange={value => {
      }}>
          <HoveringToolbar/>
          <Editable
              id={'editable'}
              className={'editor'}
              renderElement={renderElement}
              renderLeaf={renderLeaf}
              decorate={decorate}
              readOnly={!EditorManager.editable || EditorManager.isLocked}
              spellCheck={!EditorManager.editable || EditorManager.isLocked}
              suppressContentEditableWarning={true}
              onKeyDown={(event) => {
                  return handleKeyDown(event, EditorManager.slateEditor)
              }}
              onDOMBeforeInput={(event: InputEvent) => {
                  handleDOMBeforeInput(event)
              }}
          />
          <MentionListComponent editor={EditorManager.slateEditor} />
          <CommandListComponent editor={EditorManager.slateEditor} />
          <LinkMenuComponent/>
      </Slate>
  })
