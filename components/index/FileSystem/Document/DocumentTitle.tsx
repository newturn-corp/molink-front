import React, { useRef } from 'react'
import { observer } from 'mobx-react'
import FileSystemManager from '../../../../manager/FileSystemManager'
import Document from '../../../../domain/Document'
import EventManager, { Event } from '../../../../manager/EventManager'
import UserManager from '../../../../manager/UserManager'

const getTitle = (document: Document) => {
    const childrenLength = document.directoryInfo.children.length
    if (childrenLength > 0 && !document.directoryInfo.isChangingName && UserManager.setting && UserManager.setting.showSubDocumentCount) {
        return `${document.meta.title} (${childrenLength})`
    }
    return document.meta.title
}

export const DocumentTitle: React.FC<{
    document: Document
  }> = observer(({ document }) => {
      const inputRef = useRef<HTMLDivElement>(null)
      const textClassName = document.directoryInfo.isOpen ? 'text text-opened' : 'text'

      if (document.directoryInfo.isChangingName && inputRef) {
          new Promise(resolve => setTimeout(resolve, 30)).then(() => {
              if (!inputRef.current) {
                  return
              }
              inputRef.current.focus()
              const range = globalThis.document.createRange()
              if (!inputRef.current.firstChild) {
                  return
              }
              range.selectNodeContents(inputRef.current)
              range.setStart(inputRef.current.firstChild, document.meta.title.length)
              range.setEnd(inputRef.current.firstChild, document.meta.title.length)
              const selection = window.getSelection()
              selection.removeAllRanges()
              selection.addRange(range)
          })
      }

      const handleChangeNameEnd = async () => {
          FileSystemManager.selectedDocument = null
          document.directoryInfo.isChangingName = false
      }

      return <div className={'document-title'} style={{
          borderTop: document.directoryInfo.tryingGetOlderSibling ? '2px solid #e6e6e6' : '2px solid #00000000',
          borderBottom: document.directoryInfo.tryingGetYoungerSibling ? '2px solid #e6e6e6' : '2px solid #00000000'
      }} >
          <div
              contentEditable={document.directoryInfo.isChangingName}
              ref={inputRef}
              className={textClassName}
              spellCheck={false}
              onKeyDown={async event => {
                  if (event.key !== 'Enter') {
                      return
                  }
                  event.preventDefault()
                  if (document.directoryInfo.isChangingName) {
                      await document.meta.setDocumentTitle(inputRef.current.innerText)
                      await EventManager.issueEvent(Event.ChangeDocumentTitleInFileSystem, { document, title: inputRef.current.innerText })
                      handleChangeNameEnd()
                  }
              }}
              onBlur={async () => {
                  if (document.directoryInfo.isChangingName) {
                      await document.meta.setDocumentTitle(inputRef.current.innerText)
                      await EventManager.issueEvent(Event.ChangeDocumentTitleInFileSystem, { document, title: inputRef.current.innerText })
                      handleChangeNameEnd()
                  }
              }}
          >{getTitle(document)}</div>
      </div>
  })
