import React from 'react'
import { DocumentElement } from '../../../Types/slate/CustomElement'
import RoutingManager, { Page } from '../../../manager/global/RoutingManager'

export const SlateDocumentElement: React.FC<{
    attributes,
    children,
    element: DocumentElement
  }> = ({ attributes, children, element }) => {
      return (
          <div {...attributes}>
              {children}
              <div
                  contentEditable={false}
                  className={'document'}
                  onClick={async () => {
                      await RoutingManager.moveTo(Page.Index, '?id=' + element.documentId)
                  }}
              >
                  {/* <div className='icon'> */}
                  {/*     {DocumentManager.documentMap.get(element.pageID).meta.icon} */}
                  {/* </div> */}
                  {/* <div className='text'> */}
                  {/*     {DocumentManager.documentMap.get(element.pageID).meta.title} */}
                  {/* </div> */}
              </div>
          </div>
      )
  }
