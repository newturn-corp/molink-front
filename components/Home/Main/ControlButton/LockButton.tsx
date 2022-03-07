import { observer } from 'mobx-react'
import React from 'react'
import EditorManager from '../../../../manager/Blog/EditorManager'
import LockIcon from 'public/image/icon/lock.svg'
import UnlockIcon from 'public/image/icon/unlock.svg'
import { ContentControlButton } from './ContentControlButton'

export const LockButton: React.FC<{
}> = observer(() => {
    return <ContentControlButton
        onClick={() => {
            EditorManager.updateIsLocked(!EditorManager.isLocked)
        }}
        color={EditorManager.isLocked ? '#000000' : '#ABB3BB'}
        icon={
            EditorManager.isLocked
                ? <LockIcon/>
                : <UnlockIcon/>}
    />
})
