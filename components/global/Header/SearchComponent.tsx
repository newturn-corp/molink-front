import React from 'react'
import { observer } from 'mobx-react'

import { Input } from 'antd'
import SearchManager from '../../../manager/SearchManager'
import RoutingManager, { Page } from '../../../manager/RoutingManager'

const { Search } = Input

export const SearchComponent: React.FC<{
  }> = observer(() => {
      const onSearch = async value => {
          await SearchManager.search(value)
          RoutingManager.moveTo(Page.Search, `?q=${value}`)
      }

      return <Search className='search' placeholder="input search text" onSearch={onSearch} style={{ width: 200 }} />
  })
