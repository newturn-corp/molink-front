import React from 'react'
import { DocumentElement } from '../../utils/slate'
import RoutingManager, { Page } from '../../manager/RoutingManager'
import DocumentManager from '../../manager/DocumentManager'

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
                  onClick={() => {
                      RoutingManager.moveTo(Page.Index, '?id=' + element.documentId)
                  }}
              >
                  <div className='icon'>
                      {DocumentManager.documentMap.get(element.documentId).meta.icon}
                  </div>
                  <div className='text'>
                      {DocumentManager.documentMap.get(element.documentId).meta.title}
                  </div>
              </div>
          </div>
      )
  }
