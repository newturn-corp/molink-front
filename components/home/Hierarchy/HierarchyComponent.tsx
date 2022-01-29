import React from 'react'
import { observer } from 'mobx-react'
import List from '@material-ui/core/List'
import { DocumentComponent } from './Document/DocumentComponent'

import HierarchyManager from '../../../manager/Home/HierarchyManager/HierarchyManager'

export const HierarchyComponent: React.FC<{
  }> = observer(() => {
      console.log('render HierarchyComponent')
      return (
          <List
              component="nav"
              aria-labelledby="nested-list-subheader"
          >
              {
                  HierarchyManager.hierarchy.topLevelDocumentIdList.map(documentId => {
                      return <DocumentComponent key={Math.random()} documentId={documentId} depth={0}/>
                  })
              }
              <div id="moved-location-viewer" className="MuiListItem-root" style={{
                  backgroundColor: '#333333',
                  visibility: 'hidden'
              }} />
              <div style={{
                  width: '100%',
                  height: 200
              }} />
          </List>
      )
  })
