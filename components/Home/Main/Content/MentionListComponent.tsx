import React, { useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import { observer } from 'mobx-react'
import { Editor } from 'slate'
import { ReactEditor } from 'slate-react'
import MentionManager from '../../../../manager/Editing/MentionManager'

const Portal = ({ children }) => {
    return typeof document === 'object'
        ? ReactDOM.createPortal(children, document.body)
        : null
}

export const MentionListComponent: React.FC<{
    editor: Editor
  }> = observer(({ editor }) => {
      const ref = useRef<HTMLDivElement | null>()

      useEffect(() => {
          if (MentionManager.target && MentionManager.characters.length > 0) {
              const el = ref.current
              const domRange = ReactEditor.toDOMRange(editor, MentionManager.target)
              const rect = domRange.getBoundingClientRect()
              el.style.top = `${rect.top + window.pageYOffset + 24}px`
              el.style.left = `${rect.left + window.pageXOffset}px`
          }
      }, [MentionManager.characters.length, editor, MentionManager.index, MentionManager.search, MentionManager.target])

      return MentionManager.target
          ? (<Portal>
              <div
                  ref={ref}
                  style={{
                      top: '-9999px',
                      left: '-9999px',
                      position: 'absolute',
                      zIndex: 1,
                      padding: '3px',
                      background: 'white',
                      borderRadius: '4px',
                      boxShadow: '0 1px 5px rgba(0,0,0,.2)'
                  }}
                  data-cy="mentions-portal"
              >
                  {MentionManager.characters.map((char, i) => (
                      <div
                          key={char}
                          style={{
                              padding: '1px 3px',
                              borderRadius: '3px',
                              background: i === MentionManager.index ? '#B4D5FF' : 'transparent'
                          }}
                      >
                          {char}
                      </div>
                  ))}
              </div>
          </Portal>)
          : <></>
  })
