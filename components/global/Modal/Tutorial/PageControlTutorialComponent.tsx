import React, { useCallback } from 'react'
import { observer } from 'mobx-react'
import { TutorialEditingShortcutDescription } from './Editing/TutorialEditingShortcutDescription'
import { TutorialEditingUploadFileDescription } from './Editing/TutorialEditingUploadFileDescription'
import { TutorialComponent } from './TutorialComponent'
import { TutorialPageControlLockPageDescription } from './PageControl/TutorialPageControlLockPageDescription'
import { TutorialPageControlPublishDescription } from './PageControl/TutorialPageControlPublishDescription'
import { TutorialPageControlVisibilityDescription } from './PageControl/TutorialPageControlVisibilityDescription'
import TutorialManager from '../../../../manager/global/TutorialManager'

export const PageControlTutorialComponent: React.FC<{
}> = observer((props) => {
    const getDescription = useCallback(() => {
        switch (TutorialManager.step) {
        case 0:
            return <TutorialPageControlLockPageDescription/>
        case 1:
            return <TutorialPageControlVisibilityDescription/>
        case 2:
            return <TutorialPageControlPublishDescription/>
        default:
            return <></>
        }
    }, [TutorialManager.step])

    return <TutorialComponent
        length={3}
    >
        {
            getDescription()
        }
    </TutorialComponent>
})
