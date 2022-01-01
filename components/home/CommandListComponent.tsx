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
    index: number,
    command: Command
}> = ({ index, command }) => {
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
          const el = ref.current
          if (CommandManager.target && CommandManager.searchedCommands.length > 0) {
              const domSelection = window.getSelection()
              const domRange = domSelection.getRangeAt(0)
              const rect = domRange.getBoundingClientRect()

              el.style.opacity = '1'
              if (globalThis.document.body.clientHeight < rect.top + el.offsetHeight + 100) {
                  el.style.top = `${rect.top - el.offsetHeight - 5}px`
                  el.style.left = `${rect.left + 5}px`
              } else {
                  el.style.top = `${rect.top + rect.height + 5}px`
                  el.style.left = `${rect.left + 5}px`
              }
              // Command 이동에 따라 자동 스크롤 조정
              const currentHeight = 58 * CommandManager.index
              if (currentHeight < el.scrollTop) {
                  el.scrollTop = currentHeight
              } else if (currentHeight > el.scrollTop + 400) {
                  el.scrollTop = currentHeight - 400 + 58
              }
          } else {
              el.removeAttribute('style')
          }
      }, [CommandManager.commandsList.length, editor, CommandManager.index, CommandManager.search, CommandManager.target])

      return <Portal>
          <div
              ref={ref}
              className='command-list'
              data-cy="mentions-portal"
          >
              {CommandManager.searchedCommands.map((command, i) => (
                  <CommandBlock key={`command-block-parent-${command.name}`} index={i} command={command} />
              ))}
          </div>
      </Portal>
  })
