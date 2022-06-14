import { observer } from 'mobx-react'
import React from 'react'
import { CircularProgress, createStyles, TextField } from '@material-ui/core'
import LinkManager from '../../../../../manager/Editing/Link/LinkManager'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            width: '100%',
            '& .MuiInputBase-root': {
                fontFamily: 'Pretendard',
                fontStyle: 'normal',
                fontWeight: 'normal'
            },
            '& .MuiInputBase-input': {
                fontStyle: 'normal',
                fontWeight: '500'
            },
            '& .MuiInput-underline:after': {
                borderBottomColor: '#DDE3E9'
            },
            '& .MuiOutlinedInput-root': {
                borderRadius: 5,
                '& fieldset': {
                    borderColor: '#DDE3E9'
                },
                '&:hover fieldset': {
                    borderColor: '#B9E2FF'
                },
                '&.Mui-focused fieldset': {
                    borderColor: '#0094FF',
                    borderWidth: 1
                }
            }
        }
    })
)

export const LinkInputTextField: React.FC<{
    params: any
}> = observer(({ params }) => {
    const classes = useStyles()

    return <TextField {...params}
        classes={classes}
        placeholder='문서 제목 또는 링크 입력'
        variant="outlined"
        onKeyDown={(event) => {
            if (event.key === 'Enter') {
                LinkManager.hoveringToolbar.handleEnter()
            }
        }}
        InputProps={{
            ...params.InputProps,
            endAdornment: (
                <div>
                    {LinkManager.hoveringToolbar.isSearching ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                </div>
            )
        }}
    />
})
