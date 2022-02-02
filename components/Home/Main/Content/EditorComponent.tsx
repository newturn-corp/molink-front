import { observer } from 'mobx-react'
import React, { useCallback, useMemo } from 'react'
import { Editable, Slate } from 'slate-react'

import { CustomElementComponent } from '../../SlateElement/CustomElementComponent'
import { CustomLeafComponent } from '../../SlateElement/CustomLeafComponent'

import { MentionListComponent } from './MentionListComponent'
import { CommandListComponent } from './CommandListComponent'
import { HoveringToolbar } from '../HoveringToolbar'
import ContentManager from '../../../manager/Home/ContentManager/ContentManager'
import EditorManager from '../../../manager/EditorManager'
import { CursorEditor, useCursors } from 'slate-yjs'
import { handleDOMBeforeInput, handleKeyDown } from '../../../plugin'

export const EditorComponent: React.FC<{
  }> = observer(() => {
      const renderElement = useCallback(props => <CustomElementComponent {...props} />, [])
      const renderLeaf = useCallback(props => <CustomLeafComponent {...props} />, [])
      const { decorate } = useCursors(EditorManager.editor as CursorEditor)

      return <Slate editor={EditorManager.editor} value={[]} onChange={value => {
          if (!ContentManager.editable) {
              console.log('수정 불가')
          }
      }}>
          <HoveringToolbar/>
          <Editable
              renderElement={renderElement}
              renderLeaf={renderLeaf}
              decorate={decorate}
              // readOnly={!ContentManager.editable}
              // placeholder="Enter some rich text…"
              // spellCheck={!ContentManager.editable}
              onKeyDown={(event) => {
                  handleKeyDown(event, EditorManager.editor)
              }}
              onDOMBeforeInput={(event: InputEvent) => {
                  handleDOMBeforeInput(event)
              }}
          />
          <MentionListComponent editor={EditorManager.editor} />
          <CommandListComponent editor={EditorManager.editor} />
      </Slate>
  })
