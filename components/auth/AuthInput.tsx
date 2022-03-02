import { createStyles, TextField, withStyles } from '@material-ui/core'
import React, { ChangeEventHandler, ClipboardEventHandler, FocusEventHandler } from 'react'
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
            '& label.Mui-focused': {
                color: '#3A7BBF'
            },
            '& .MuiInput-underline:after': {
                borderBottomColor: '#DDE3E9'
            },
            '& .MuiOutlinedInput-root': {
                borderRadius: 10,
                '& fieldset': {
                    borderColor: '#DDE3E9'
                },
                '&:hover fieldset': {
                    borderColor: '#3A7BBF'
                },
                '&.Mui-focused fieldset': {
                    borderColor: '#3A7BBF',
                    borderWidth: 1
                },
                '&.Mui-error fieldset': {
                    borderColor: 'rgba(248, 67, 67, 1)'
                }
            },
            '& .MuiInputLabel-outlined': {
                fontFamily: 'Pretendard',
                fontWeight: 'normal',
                color: '#9DA7B0'
                // fontSize: 13
            },
            '&:hover .MuiInputLabel-outlined': {
                color: '#3A7BBF'
            },
            '& .MuiInputLabel-outlined.Mui-error': {
                color: 'rgba(248, 67, 67, 1)'
            },
            '& .MuiFormHelperText-root': {
                height: 20,
                marginBottom: 5
            }
        }
    })
)

type AuthInputProps = {
    label: string,
    type: string,
    variant: 'outlined',
    autoComplete: string,
    error: boolean,
    onChange?: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>,
    onFocus?: FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>,
    onPaste?: ClipboardEventHandler<HTMLDivElement>,
    style?: any,
    helperText?: string
}

export const AuthInput: React.FC<AuthInputProps> = (props: AuthInputProps) => {
    const classes = useStyles()
    return <>
        <TextField
            className={classes.root}
            style={{
                marginBottom: !props.helperText && 12
            }}
            {...props}
        />
    </>
}
