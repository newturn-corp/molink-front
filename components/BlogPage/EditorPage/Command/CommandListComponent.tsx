import React, { useEffect, useRef, useState } from 'react'
import { observer } from 'mobx-react'
import { Editor } from 'slate'
import CommandManager from '../../../../manager/Editing/Command/CommandManager'
import { Portal } from '../../../utils/Portal'
import { CommandBlock } from './CommandBlock'

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
