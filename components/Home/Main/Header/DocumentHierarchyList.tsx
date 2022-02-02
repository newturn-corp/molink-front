import { observer } from 'mobx-react'
import React from 'react'
import Document from '../../../domain/Document'
import ContentManager from '../../../manager/ContentManager'
import RoutingManager, { Page } from '../../../manager/global/RoutingManager'

const getHierarchy = (document: Document, arr: Document[]) => {
    arr.unshift(document)
    const parent = document.directoryInfo.parent
    if (parent) {
        return getHierarchy(parent, arr)
    }
    return arr
}

export const DocumentHierarchyList: React.FC<{
  }> = observer(() => {
      const documents = getHierarchy(ContentManager.openedDocument, []) as Document[]
      return <div className={'hierarchy'}>
          {
              documents.map((document, index) => {
                  return <>
                      <div
                          className='document-block'
                          key={`hierarchy-document-block-${index}`}
                          onClick={() => {
                              if (document.equal(ContentManager.openedDocument)) {
                                  return
                              }
                              RoutingManager.moveTo(Page.Index, `?id=${document.meta.id}`)
                          }}
                      >
                          {document.meta.icon + ' ' + document.meta.title}
                      </div>
                      {
                          documents.length - 1 === index
                              ? <></>
                              : <div className='document-divider'>
                                  /
                              </div>
                      }
                  </>
              })
          }
      </div>
  })
