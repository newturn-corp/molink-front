import React, { useRef } from 'react'
import { observer } from 'mobx-react'
import { HierarchyDocumentInfoInterface } from '@newturn-develop/types-molink'
import UserManager from '../../../manager/global/User/UserManager'
import StyleManager from '../../../manager/global/Style/StyleManager'
import Blog from '../../../manager/global/Blog/Blog'
import { isBrowser } from 'react-device-detect'

const getTitle = (page: HierarchyDocumentInfoInterface, isChangingName: boolean) => {
    const childrenLength = page.children.length
    if (childrenLength > 0 && !isChangingName && UserManager.setting.showSubDocumentCount) {
        return `${page.title} (${childrenLength})`
    }
    return page.title
}

export const PageTitle: React.FC<{
    pageID: string
  }> = observer(({ pageID }) => {
      const inputRef = useRef<HTMLDivElement>(null)
      const pageHierarchy = Blog.pageHierarchy
      const page = pageHierarchy.map[pageID]
      const isChangingName = pageHierarchy.nameChangingPageId === page.id
      const isPageOpen = pageHierarchy.openedPage && pageHierarchy.openedPage.pageId === page.id
      const textClassName = isPageOpen ? 'text text-opened' : 'text'

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
          style={{
              fontSize: isBrowser ? 15 : 16,
              overflow: isChangingName ? undefined : 'hidden',
              textOverflow: isChangingName ? undefined : 'ellipsis'
          }}
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
                      await pageHierarchy.updatePageTitle(page.id, inputRef.current.innerText)
                  }
              }}
              onBlur={async () => {
                  if (isChangingName) {
                      await pageHierarchy.updatePageTitle(page.id, inputRef.current.innerText)
                  }
              }}
          >
              {getTitle(page, isChangingName)}
          </div>
      </div>
  })
