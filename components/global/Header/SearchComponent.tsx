import React from 'react'
import { observer } from 'mobx-react'

import { Input } from 'antd'
import RoutingManager, { Page } from '../../../manager/global/RoutingManager'
import LanguageManager from '../../../manager/global/LanguageManager'

const { Search } = Input

export const SearchComponent: React.FC<{
  }> = observer(() => {
      const onSearch = async value => {
          await RoutingManager.moveTo(Page.SearchPage, `?q=${value}&page=1`)
      }

      return <div
          className={'search-container'}
      >
          <Search
              className='search'
              placeholder={LanguageManager.languageMap.SearchPlaceholder}
              onSearch={onSearch}
              style={{
                  width: 360
              }}
          />
      </div>
  })
