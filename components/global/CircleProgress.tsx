import React from 'react'
import { CircularProgress } from '@material-ui/core'

export const CircleProgress: React.FC<{
    visible?: boolean
}> = ({ visible }) => {
    // false라고 명시해야만 보이지 않도록
    if (visible === false) {
        return <></>
    }
    return <CircularProgress/>
}
