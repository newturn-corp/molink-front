import { observer } from 'mobx-react'
import React, { useCallback } from 'react'
import { Editable, Slate } from 'slate-react'

import { MentionListComponent } from './MentionListComponent'
import { CommandListComponent } from './CommandListComponent'
import { CursorEditor, useCursors } from 'slate-yjs'
import { CustomElementComponent } from '../../../SlateElement/CustomElementComponent'
import { CustomLeafComponent } from '../../../SlateElement/CustomLeafComponent'
import { HoveringToolbar } from './HoveringToolbar'
import { handleDOMBeforeInput, handleKeyDown } from '../../../../plugin'
import EditorManager from '../../../../manager/Home/EditorManager'

export const EditorComponent: React.FC<{
  }> = observer(() => {
      const renderElement = useCallback(props => <CustomElementComponent {...props} />, [])
      const renderLeaf = useCallback(props => <CustomLeafComponent {...props} />, [])
      const { decorate } = useCursors(EditorManager.slateEditor as CursorEditor)

      return <Slate editor={EditorManager.slateEditor} value={[]} onChange={value => {
      }}>
          <HoveringToolbar/>
          <Editable
              renderElement={renderElement}
              renderLeaf={renderLeaf}
              decorate={decorate}
              readOnly={!EditorManager.editable || EditorManager.isLocked}
              spellCheck={!EditorManager.editable || EditorManager.isLocked}
              onKeyDown={(event) => {
                  handleKeyDown(event, EditorManager.slateEditor)
              }}
              onDOMBeforeInput={(event: InputEvent) => {
                  handleDOMBeforeInput(event)
              }}
          />
          <MentionListComponent editor={EditorManager.slateEditor} />
          <CommandListComponent editor={EditorManager.slateEditor} />
      </Slate>
  })
