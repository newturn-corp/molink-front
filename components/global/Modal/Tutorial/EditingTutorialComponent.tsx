import React, { useCallback } from 'react'
import { observer } from 'mobx-react'
import { TutorialEditingCommandDescription } from './Editing/TutorialEditingCommandDescription'
import { TutorialEditingShortcutDescription } from './Editing/TutorialEditingShortcutDescription'
import { TutorialEditingUploadFileDescription } from './Editing/TutorialEditingUploadFileDescription'
import { TutorialComponent } from './TutorialComponent'
import TutorialManager from '../../../../manager/global/TutorialManager'

export const EditingTutorialComponent: React.FC<{
}> = observer(() => {
    const getDescription = useCallback(() => {
        switch (TutorialManager.step) {
        case 0:
            return <TutorialEditingCommandDescription/>
        case 1:
            return <TutorialEditingShortcutDescription/>
        case 2:
            return <TutorialEditingUploadFileDescription/>
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
