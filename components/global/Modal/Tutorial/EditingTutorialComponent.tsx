import React, { useCallback } from 'react'
import { observer } from 'mobx-react'
import { TutorialEditingCommandDescription } from './Editing/TutorialEditingCommandDescription'
import { TutorialEditingShortcutDescription } from './Editing/TutorialEditingShortcutDescription'
import { TutorialEditingUploadFileDescription } from './Editing/TutorialEditingUploadFileDescription'
import { TutorialComponent } from './TutorialComponent'

export const EditingTutorialComponent: React.FC<{
    onStepOverflow: Function,
    onStepUnderflow: Function
}> = observer((props) => {
    const [activeStep, setActiveStep] = React.useState(0)

    const handleNext = () => {
        if (activeStep === 2) {
            props.onStepOverflow()
        } else {
            setActiveStep((prevActiveStep) => prevActiveStep + 1)
        }
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
            return <TutorialEditingCommandDescription/>
        case 1:
            return <TutorialEditingShortcutDescription/>
        case 2:
            return <TutorialEditingUploadFileDescription/>
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
        disableNextButton={false}
    >
        {
            getDescription()
        }
    </TutorialComponent>
})
