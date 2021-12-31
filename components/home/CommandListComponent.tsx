import React, { useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import { observer } from 'mobx-react'
import '../../utils/prism'
import { Editor } from 'slate'
import { ReactEditor } from 'slate-react'
import CommandManager from '../../manager/CommandManager'
import Command from '../../domain/Command'

const Portal = ({ children }) => {
    return typeof document === 'object'
        ? ReactDOM.createPortal(children, document.body)
        : null
}

const CommandBlock: React.FC<{
    key: string | number,
    index: number,
    command: Command
}> = ({ key, index, command }) => {
    const className = index === CommandManager.index ? 'command-block selected' : 'command-block'
    return <div
        key={`command-block-${command.name}`}
        className={className}
    >
        <img key={`command-block-img-${command.name}`} className='command-img' src={command.imgSrc}/>
        <div key={`command-block-text-container${command.name}`} className='text-container'>
            <p key={`command-block-name-${command.name}`} className='name'>{command.name}</p>
            <p key={`command-block-description-${command.name}`} className='description'>{command.description}</p>
        </div>
    </div>
}

export const CommandListComponent: React.FC<{
    editor: Editor
  }> = observer(({ editor }) => {
      const ref = useRef<HTMLDivElement | null>()

      useEffect(() => {
          if (CommandManager.target && CommandManager.commandsList.length > 0) {
              const el = ref.current
              const domSelection = window.getSelection()
              const domRange = domSelection.getRangeAt(0)
              const rect = domRange.getBoundingClientRect()
              if (globalThis.document.body.clientHeight < rect.top + el.offsetHeight) {
                  el.style.top = `${rect.top - el.offsetHeight - 5}px`
                  el.style.left = `${rect.left + 5}px`
              } else {
                  el.style.top = `${rect.top + rect.height + 5}px`
                  el.style.left = `${rect.left + 5}px`
              }
          }
      }, [CommandManager.commandsList.length, editor, CommandManager.index, CommandManager.search, CommandManager.target])

      return CommandManager.target
          ? (<Portal>
              <div
                  ref={ref}
                  className='command-list'
                  data-cy="mentions-portal"
              >
                  {CommandManager.searchedCommands.map((command, i) => (
                      <CommandBlock key={Math.random()} index={i} command={command} />
                  ))}
              </div>
          </Portal>)
          : <></>
  })
