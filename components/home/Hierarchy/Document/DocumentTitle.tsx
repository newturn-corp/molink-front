import React, { useRef } from 'react'
import { observer } from 'mobx-react'
import Document from '../../../../domain/Document/Document'
import EventManager, { Event } from '../../../../manager/EventManager'
import UserManager from '../../../../manager/global/UserManager'
import DocumentHierarchyManager from '../../../../manager/Home/DocumentHierarchyManager/DocumentHierarchyManager'
import DocumentManager from '../../../../manager/Home/DocumentManager'
import { HierarchyComponentBlockInterface, HierarchyDocumentInfoInterface } from '@newturn-develop/types-molink'

const getTitle = (document: HierarchyDocumentInfoInterface, documentHierarchyBlock: HierarchyComponentBlockInterface, isChangingName: boolean) => {
    const childrenLength = documentHierarchyBlock.children.length
    if (childrenLength > 0 && !isChangingName && UserManager.setting && UserManager.setting.showSubDocumentCount) {
        return `${document.title} (${childrenLength})`
    }
    return document.title
}

export const DocumentTitle: React.FC<{
    document: HierarchyDocumentInfoInterface,
    documentHierarchyBlock: HierarchyComponentBlockInterface
  }> = observer(({ document, documentHierarchyBlock }) => {
      const inputRef = useRef<HTMLDivElement>(null)
      const isChangingName = DocumentHierarchyManager.hierarchy.checkIsDocumentChangingName(document.id)
      const isDocumentOpen = DocumentManager.checkIsDocumentOpen(document.id)
      const textClassName = isDocumentOpen ? 'text text-opened' : 'text'

      if (isChangingName && inputRef) {
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
              range.setStart(inputRef.current.firstChild, document.title.length)
              range.setEnd(inputRef.current.firstChild, document.title.length)
              const selection = window.getSelection()
              selection.removeAllRanges()
              selection.addRange(range)
          })
      }

      const handleChangeNameEnd = async () => {
          DocumentHierarchyManager.hierarchy.setSelectedDocumentId(null)
          DocumentHierarchyManager.hierarchy.setNameChangingDocumentId(null)
      }

      return <div className={'document-title'} >
          <div
              contentEditable={isChangingName}
              ref={inputRef}
              className={textClassName}
              spellCheck={false}
              onKeyDown={async event => {
                  if (event.key !== 'Enter') {
                      return
                  }
                  event.preventDefault()
                  if (isChangingName) {
                      //   await document.setDocumentTitle(inputRef.current.innerText)
                      await EventManager.issueEvent(Event.ChangeDocumentTitleInFileSystem, { document, title: inputRef.current.innerText })
                      handleChangeNameEnd()
                  }
              }}
              onBlur={async () => {
                  if (isChangingName) {
                      //   await document.setDocumentTitle(inputRef.current.innerText)
                      await EventManager.issueEvent(Event.ChangeDocumentTitleInFileSystem, { document, title: inputRef.current.innerText })
                      handleChangeNameEnd()
                  }
              }}
          >{getTitle(document, documentHierarchyBlock, isChangingName)}</div>
      </div>
  })
