import { observer } from 'mobx-react'
import React, { useCallback, useMemo, useState } from 'react'
import { Editable, withReact, Slate } from 'slate-react'
import {
    createEditor
} from 'slate'
import { withHistory } from 'slate-history'
import ContentManager from '../manager/ContentManager'
import { BlockComponent, BlockNoLeafComponent } from './BlockComponent'

export const Editor: React.FC<{
  }> = observer(() => {
      const renderElement = useCallback(props => <BlockComponent {...props} />, [])
      const renderLeaf = useCallback(props => <BlockNoLeafComponent {...props} />, [])
      const editor = useMemo(() => withHistory(withReact(createEditor())), [])
      if (!ContentManager.content) {
          return <></>
      }
      return <div className={'contents'}>
          <Slate editor={editor} value={ContentManager.content} onChange={value => {
              ContentManager.content = value
              ContentManager.handleOnChange()
          }}>
              <Editable
                  renderElement={renderElement}
                  renderLeaf={renderLeaf}
                  placeholder="Enter some rich text…"
                  spellCheck
                  autoFocus
                  onKeyDown={(e) => {
                      ContentManager.handleKeyDown(editor, e)
                  }}
              />
          </Slate>
      </div>
      //   return <></>
  })
