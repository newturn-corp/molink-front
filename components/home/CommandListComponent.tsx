import React, { useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import { observer } from 'mobx-react'
import '../../utils/prism'
import { Editor } from 'slate'
import { ReactEditor } from 'slate-react'
import CommandManager from '../../manager/home/CommandManager'

const Portal = ({ children }) => {
    return typeof document === 'object'
        ? ReactDOM.createPortal(children, document.body)
        : null
}

export const CommandListComponent: React.FC<{
    editor: Editor
  }> = observer(({ editor }) => {
      const ref = useRef<HTMLDivElement | null>()

      useEffect(() => {
          if (CommandManager.target && CommandManager.commandsList.length > 0) {
              const el = ref.current
              const domRange = ReactEditor.toDOMRange(editor, CommandManager.target)
              const rect = domRange.getBoundingClientRect()
              el.style.top = `${rect.top + window.pageYOffset + 24}px`
              el.style.left = `${rect.left + window.pageXOffset}px`
          }
      }, [CommandManager.commandsList.length, editor, CommandManager.index, CommandManager.search, CommandManager.target])

      return CommandManager.target
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
                  {CommandManager.searchedCommands.map((char, i) => (
                      <div
                          key={char}
                          style={{
                              padding: '1px 3px',
                              borderRadius: '3px',
                              background: i === CommandManager.index ? '#B4D5FF' : 'transparent'
                          }}
                      >
                          {char}
                      </div>
                  ))}
              </div>
          </Portal>)
          : <></>
  })
