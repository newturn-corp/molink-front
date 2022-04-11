import React, { useRef } from 'react'
import { observer } from 'mobx-react'
import { HierarchyDocumentInfoInterface } from '@newturn-develop/types-molink'
import UserManager from '../../../../manager/global/User/UserManager'
import HierarchyManager from '../../../../manager/global/Hierarchy/HierarchyManager'
import StyleManager from '../../../../manager/global/Style/StyleManager'

const getTitle = (document: HierarchyDocumentInfoInterface, isChangingName: boolean) => {
    const childrenLength = document.children.length
    if (childrenLength > 0 && !isChangingName && UserManager.setting.showSubDocumentCount) {
        return `${document.title} (${childrenLength})`
    }
    return document.title
}

export const PageTitle: React.FC<{
    documentId: string
  }> = observer(({ documentId }) => {
      const inputRef = useRef<HTMLDivElement>(null)
      const currentHierarchy = HierarchyManager.hierarchyMap.get(HierarchyManager.currentHierarchyUserId)
      const page = currentHierarchy.map[documentId]
      const isChangingName = currentHierarchy.nameChangingPageId === page.id
      const isDocumentOpen = currentHierarchy.openedPageId === page.id
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
              range.setStart(inputRef.current.firstChild, page.title.length)
              range.setEnd(inputRef.current.firstChild, page.title.length)
              const selection = window.getSelection()
              selection.removeAllRanges()
              selection.addRange(range)
          })
      }

      return <div
          className={'page-title'}
          style={StyleManager.hierarchyStyle.pageTitleStyle}
      >
          <div
              contentEditable={isChangingName}
              suppressContentEditableWarning={true}
              ref={inputRef}
              className={textClassName}
              spellCheck={false}
              onKeyDown={async event => {
                  if (event.key !== 'Enter') {
                      return
                  }
                  event.preventDefault()
                  if (isChangingName) {
                      await currentHierarchy.updatePageTitle(page.id, inputRef.current.innerText)
                  }
              }}
              onBlur={async () => {
                  if (isChangingName) {
                      await currentHierarchy.updatePageTitle(page.id, inputRef.current.innerText)
                  }
              }}
          >{getTitle(page, isChangingName)}</div>
      </div>
  })
