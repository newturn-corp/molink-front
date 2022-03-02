import { createStyles, TextField, withStyles } from '@material-ui/core'
import React, { ChangeEventHandler, ClipboardEventHandler, FocusEventHandler } from 'react'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            width: '100%',
            '& label.Mui-focused': {
                color: '#5F6871'
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
                    borderColor: '#5F6871'
                },
                '&.Mui-focused fieldset': {
                    borderColor: '#5F6871',
                    borderWidth: 1
                },
                '&.Mui-error fieldset': {
                    borderColor: 'rgba(248, 67, 67, 1)'
                }
            },
            '& .MuiInputLabel-outlined': {
                fontFamily: 'Pretendard',
                fontWeight: 'normal',
                color: '#5F6871'
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
