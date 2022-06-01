import { observer } from 'mobx-react'
import React from 'react'
import { LockButton } from './LockButton'
import { VisibilityButton } from './VisibilityButton'
import { PublishButton } from './PublishButton'

export const ContentControlButtonGroup: React.FC<{
}> = observer(() => {
    return <div
        className={'content-control-button-group'}
    >
        <PublishButton/>
        <LockButton/>
        <VisibilityButton/>
    </div>
})
