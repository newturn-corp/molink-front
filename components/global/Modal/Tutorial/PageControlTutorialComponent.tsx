import React, { useCallback } from 'react'
import { observer } from 'mobx-react'
import { TutorialEditingShortcutDescription } from './Editing/TutorialEditingShortcutDescription'
import { TutorialEditingUploadFileDescription } from './Editing/TutorialEditingUploadFileDescription'
import { TutorialComponent } from './TutorialComponent'
import { TutorialPageControlLockPageDescription } from './PageControl/TutorialPageControlLockPageDescription'
import { TutorialPageControlPublishDescription } from './PageControl/TutorialPageControlPublishDescription'
import { TutorialPageControlVisibilityDescription } from './PageControl/TutorialPageControlVisibilityDescription'

export const PageControlTutorialComponent: React.FC<{
    onStepUnderflow: Function
}> = observer((props) => {
    const [activeStep, setActiveStep] = React.useState(0)

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1)
    }

    const handleBack = () => {
        if (activeStep === 0) {
            props.onStepUnderflow()
        } else {
            setActiveStep((prevActiveStep) => prevActiveStep - 1)
        }
    }

    const getDescription = useCallback(() => {
        switch (activeStep) {
        case 0:
            return <TutorialPageControlLockPageDescription/>
        case 1:
            return <TutorialPageControlVisibilityDescription/>
        case 2:
            return <TutorialPageControlPublishDescription/>
        default:
            return <></>
        }
    }, [activeStep])

    return <TutorialComponent
        length={3}
        currentStep={activeStep}
        handleNext={handleNext}
        handleBack={handleBack}
        disableBackButton={false}
        disableNextButton={activeStep === 2}
    >
        {
            getDescription()
        }
    </TutorialComponent>
})
