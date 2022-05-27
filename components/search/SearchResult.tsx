import { observer } from 'mobx-react'
import React from 'react'
import { Divider, List } from '@material-ui/core'
import SearchManager from '../../manager/global/SearchManager'
import { UserSearchResult } from './UserSearchResult'
import LanguageManager from '../../manager/global/LanguageManager'

export const SearchResults: React.FC<{
  }> = observer(() => {
      if (!SearchManager.searchResults) {
          return <></>
      }
      return <div className='search-result'>
          <div
              className={'search-text'}
          >
              {`"${SearchManager.searchText}"${LanguageManager.languageMap.For}`}
          </div>
          <div
              className={'search-result-count'}
          >
              {`${SearchManager.searchResults.length}${LanguageManager.languageMap.UserSearchResultCount}`}
          </div>
          <div
              className={'count-divider'}
          />
          <List>
              {
                  SearchManager.searchResults.length > 0
                      ? <>
                          {
                              SearchManager.searchResults.map(result => {
                                  return <>
                                      <UserSearchResult key={`user-search-result-${result.id}`} result={result} />
                                      <Divider key={`user-search-divider-${result.id}`} variant="inset" component="li" />
                                  </>
                              })
                          }
                      </>
                      : <div>
                          {LanguageManager.languageMap.NoSearchResult}
                      </div>
              }
          </List>
      </div>
  })
