import React from 'react'
import { observer } from 'mobx-react'
import List from '@material-ui/core/List'
import { PageComponent } from './Page/PageComponent'
import HierarchyManager from '../../../manager/global/Hierarchy/HierarchyManager'

export const HierarchyComponent: React.FC<{
  }> = observer(() => {
      const currentHierarchy = HierarchyManager.hierarchyMap.get(HierarchyManager.currentHierarchyUserId)
      const pageDragManager = currentHierarchy.pageDragManager
      return (
          <List
              component="nav"
              aria-labelledby="nested-list-subheader"
              style={{
                  overflowX: 'hidden',
                  overflowY: 'auto',
                  marginTop: 5
              }}
          >
              {
                  currentHierarchy.topLevelDocumentIdList.map(documentId => {
                      return <PageComponent
                          key={Math.random()}
                          documentId={documentId}
                          depth={0}
                      />
                  })
              }
              <div
                  id="moved-location-viewer"
                  className="MuiListItem-root"
                  style={{
                      backgroundColor: '#333333',
                      visibility: 'hidden'
                  }}
              />
              <div
                  id={'hierarchy-margin'}
                  style={{
                      width: '100%',
                      height: 250
                  }}
                  onDragOver={() => pageDragManager.handleDragOverHierarchyMargin()}
              />
          </List>
      )
  })
