import React, { useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import { observer } from 'mobx-react'
import '../../utils/prism'
import { Editor } from 'slate'
import { ReactEditor } from 'slate-react'
import CommandManager from '../../manager/home/CommandManager'
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
        key={key}
        className={className}
    >
        <img className='command-img' src={command.imgSrc}/>
        <div className='text-container'>
            <p className='name'>{command.name}</p>
            <p className='description'>{command.description}</p>
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
