import { observer } from 'mobx-react'
import React from 'react'
import { CircularProgress, createStyles, TextField } from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'
import isUrl from 'is-url'
import LinkManager, { LinkOption } from '../../../../../manager/Editing/Link/LinkManager'
import { throttle } from 'lodash'
import { LinkInputTextField } from './LinkInputTextField'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            '& .MuiInputBase-root': {
                fontFamily: 'Pretendard',
                fontStyle: 'normal',
                fontWeight: 'normal'
            }
        },
        groupLabel: {
        }
    })
)

export const LinkInput: React.FC<{
  }> = observer(() => {
      const classes = useStyles()

      if (!LinkManager.hoveringToolbar.isShowLinkInput) {
          return <></>
      }

      return <div className='link-input-background'
          onClick={() => {
              LinkManager.hoveringToolbar.close()
          }}>
          <div
              className='link-input'
              style={{
                  opacity: 1,
                  top: LinkManager.hoveringToolbar.selectionRect.top + window.pageYOffset - 50 + 90,
                  left: LinkManager.hoveringToolbar.selectionRect.left + window.pageXOffset - 300 / 2 + LinkManager.hoveringToolbar.selectionRect.width / 2
              }}
              onClick={(e) => e.stopPropagation()}
          >
              <Autocomplete
                  classes={classes}
                  disableClearable
                  popupIcon={<></>}
                  freeSolo={true}
                  loading={LinkManager.hoveringToolbar.isSearching}
                  options={LinkManager.hoveringToolbar.options}
                  filterOptions={o => o}
                  groupBy={(option) => option.reference}
                  getOptionLabel={(option) => option.text ? option.text : ''}
                  onInputChange={throttle((e, value) => LinkManager.hoveringToolbar.handleInputChange(value), 500)}
                  onChange={(e, value: LinkOption) => LinkManager.hoveringToolbar.handleLinkOptionChange(value)}
                  noOptionsText={isUrl(LinkManager.hoveringToolbar.currentInputValue) ? '이 링크로 연결' : '선택된 문서가 없습니다.'}
                  //   getOptionSelected={(option, value) => option.text}
                  renderOption={(option) => (
                      <React.Fragment>
                          {`${option.icon}  ${option.text}`}
                      </React.Fragment>
                  )}
                  renderInput={(params) =>
                      <LinkInputTextField params={params}/>
                  }
              />
          </div>
      </div>
  })
