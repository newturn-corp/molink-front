import React from 'react'
import { CircularProgress } from '@material-ui/core'
import { getFileSizeString } from '../../../utils/getFileSizeString'

export const FileLoading: React.FC<{
    isLoading: boolean,
    fileName: string,
    fileSize: number
}> = ({ isLoading, fileName, fileSize }) => {
    return <div
        className={'file-loading'}
        style={{
            display: isLoading ? 'flex' : 'none'
        }}
    >
        <div
            className={'progress'}
        >
            <CircularProgress
                color="inherit"
                size={24}
            />
        </div>
        <div
            style={{
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <div
                contentEditable={false}
                className={'text'}
            >
                {fileName}
            </div>
            <div
                contentEditable={false}
                className={'text'}
            >
                {getFileSizeString(fileSize)}
            </div>
        </div>
    </div>
}
