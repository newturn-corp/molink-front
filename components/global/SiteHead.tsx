import React from 'react'
import { observer } from 'mobx-react'
import Head from 'next/head'
import HierarchyManager from '../../manager/global/Hierarchy/HierarchyManager'

export const SiteHead: React.FC<{
  }> = observer(() => {
      const currentHierarchy = HierarchyManager.hierarchyMap.get(HierarchyManager.currentHierarchyUserId)
      const headText = currentHierarchy && currentHierarchy.openedDocumentId ? currentHierarchy.map[currentHierarchy.openedDocumentId].title : 'Molink'
      return <Head>
          <title>{headText}</title>
          <link rel='shortcut icon' href='/favicon.ico' />
      </Head>
  })
