import React, { useEffect, useRef } from 'react'
import { observer } from 'mobx-react'
import { Editor } from 'slate'
import CommandManager from '../../../../manager/Editing/Command/CommandManager'
import Command from '../../../../manager/Editing/Command/Command'
import { Portal } from '../../../utils/Portal'

const CommandBlock: React.FC<{
    index: number,
    command: Command
}> = ({ index, command }) => {
    const className = (index === CommandManager.index ? 'command-block selected' : 'command-block') + ' ' + (command.className ? command.className : '')
    return <div
        id={`command-block-${index}`}
        key={`command-block-${command.name}`}
        className={className}
    >
        {
            command.imgType === 'img'
                ? <img
                    key={`command-block-img-${command.name}`}
                    className='command-img'
                    src={command.imgSrc as string}
                />
                : <div
                    className='command-img'
                >
                    {command.imgSrc}
                </div>
        }
        <div
            key={`command-block-text-container${command.name}`}
            className='text-container'
        >
            <p
                key={`command-block-name-${command.name}`}
                className='name'
            >
                {command.name}
            </p>
            <p
                key={`command-block-description-${command.name}`}
                className='description'
            >
                {command.description}
            </p>
        </div>
    </div>
}

export const CommandListComponent: React.FC<{
    editor: Editor
  }> = observer(({ editor }) => {
      const containerRef = useRef<HTMLDivElement | null>()
      const ref = useRef<HTMLDivElement | null>()

      useEffect(() => {
          const containerElement = containerRef.current
          const listElement = ref.current
          if (CommandManager.target && CommandManager.searchedCommandGroupList.length > 0) {
              const domSelection = window.getSelection()
              const domRange = domSelection.getRangeAt(0)
              const rect = domRange.getBoundingClientRect()

              containerElement.style.opacity = '1'
              if (globalThis.document.body.clientHeight < rect.top + containerElement.offsetHeight + 100) {
                  containerElement.style.top = `${rect.top - containerElement.offsetHeight - 5}px`
                  containerElement.style.left = `${rect.left + 5}px`
              } else {
                  containerElement.style.top = `${rect.top + rect.height + 5}px`
                  containerElement.style.left = `${rect.left + 5}px`
              }
              // Command 이동에 따라 자동 스크롤 조정
              const currentElement = document.getElementById(`command-block-${CommandManager.index}`)
              const currentHeight = currentElement.offsetTop
              if (currentHeight < listElement.scrollTop) {
                  listElement.scrollTop = currentHeight - 16
              } else if (currentHeight > listElement.scrollTop + listElement.offsetHeight) {
                  listElement.scrollTop = currentHeight - listElement.offsetHeight + 32
              }
          } else {
              containerElement.removeAttribute('style')
          }
      }, [CommandManager.searchedCommandGroupList.length, editor, CommandManager.index, CommandManager.search, CommandManager.target])
      let index = 0
      return <Portal>
          <div
              ref={containerRef}
              className='command-list-container'
              data-cy="mentions-portal"
          >
              <div
                  ref={ref}
                  className='command-list'
              >
                  {
                      CommandManager.searchedCommandGroupList.map((group) => {
                          if (group.commands.length === 0) {
                              return <>
                              </>
                          }
                          return <div
                              key={`command-group-container-${group.name}`}
                          >
                              <div
                                  key={`command-group-name-${group.name}`}
                                  className={'command-group-name'}
                              >
                                  {group.name}
                              </div>
                              {
                                  group.commands.map((command) => (
                                      <CommandBlock
                                          key={`command-block-${index++}`}
                                          index={index}
                                          command={command}
                                      />
                                  ))
                              }
                          </div>
                      })
                  }
              </div>
          </div>
      </Portal>
  })
