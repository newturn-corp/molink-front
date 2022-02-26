import { TextField, withStyles } from '@material-ui/core'

export const AuthInput = withStyles({
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
                borderColor: '#5F6871'
            }
        },
        '& .MuiInputLabel-outlined': {
            fontFamily: 'Pretendard',
            fontWeight: 'normal',
            color: '#5F6871'
            // fontStyle: 'normal',

            // fontSize: 14,
            // lineHeight: 20,

        }
    }
})(TextField)
