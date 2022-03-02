import { observer } from 'mobx-react'
import React from 'react'
import { Divider, List } from '@material-ui/core'
import SearchManager from '../../manager/global/SearchManager'
import { UserSearchResult } from './UserSearchResult'

export const SearchResults: React.FC<{
  }> = observer(() => {
      if (!SearchManager.searchResults) {
          return <></>
      }
      return <div className='search-result'>
          <List>
              {
                  SearchManager.searchResults.map(result => {
                      return <>
                          {/* <UserSearchResult key={`user-search-result-${result.id}`} result={result} /> */}
                          <Divider key={`user-search-divider-${result.id}`} variant="inset" component="li" />
                      </>
                  })
              }
          </List>
      </div>
  })
