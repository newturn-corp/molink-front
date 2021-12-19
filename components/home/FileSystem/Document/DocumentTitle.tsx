import React, { useRef } from 'react'
import { observer } from 'mobx-react'
import Document from '../../../../domain/Document'
import DocumentManager from '../../../../manager/DocumentManager'
import DirectoryManager from '../../../../manager/DirectoryManager'
import EventManager from '../../../../manager/home/EventManager'

export const DocumentTitle: React.FC<{
    document: Document
  }> = observer(({ document }) => {
      const inputRef = useRef<HTMLDivElement>(null)
      const textClassName = document.isOpen ? 'text text-opened' : 'text'

      if (document.isChangingName && inputRef) {
          new Promise(resolve => setTimeout(resolve, 100)).then(() => {
              inputRef.current.focus()
              const range = globalThis.document.createRange()
              if (!inputRef.current.firstChild) {
                  return
              }
              range.selectNodeContents(inputRef.current)
              range.setStart(inputRef.current.firstChild, document.title.length)
              range.setEnd(inputRef.current.firstChild, document.title.length)
              const selection = window.getSelection()
              selection.removeAllRanges()
              selection.addRange(range)
          })
      }

      const handleChangeNameEnd = async () => {
          DirectoryManager.selectedDocument = null
          document.isChangingName = false
      }

      return <div className={'document-title'} style={{
          borderTop: document.tryingGetOlderSibling ? '2px solid #e6e6e6' : '2px solid #00000000',
          borderBottom: document.tryingGetYoungerSibling ? '2px solid #e6e6e6' : '2px solid #00000000'
      }} >
          <div
              contentEditable={document.isChangingName}
              ref={inputRef}
              className={textClassName}
              spellCheck={false}
              onKeyDown={event => {
                  if (event.key !== 'Enter') {
                      return
                  }
                  event.preventDefault()
                  EventManager.issueRenameDocumentTitle(document, inputRef.current.innerText)
                  handleChangeNameEnd()
              }}
              onBlur={() => {
                  EventManager.issueRenameDocumentTitle(document, inputRef.current.innerText)
                  handleChangeNameEnd()
              }}
          >{document.title}</div>
      </div>
  })
