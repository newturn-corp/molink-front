import React, { useCallback } from 'react'
import { observer } from 'mobx-react'
import { TutorialBlogMainDescription } from './Blog/TutorialBlogMainDescription'
import { TutorialBlogCreatePageDescription } from './Blog/TutorialBlogCreatePageDescription'
import { TutorialBlogBatchPageDescription } from './Blog/TutorialBlogBatchPageDescription'
import { TutorialBlogDeletePageDescription } from './Blog/TutorialBlogDeletePageDescription'
import { TutorialComponent } from './TutorialComponent'
import { TutorialInitialDescription } from './Blog/TutorialInitialDescription'

export const BlogTutorialComponent: React.FC<{
    onStepOverflow: Function
}> = observer((props) => {
    const [activeStep, setActiveStep] = React.useState(0)

    const getDescription = useCallback(() => {
        switch (activeStep) {
        case 0:
            return <TutorialInitialDescription/>
        case 1:
            return <TutorialBlogMainDescription/>
        case 2:
            return <TutorialBlogCreatePageDescription/>
        case 3:
            return <TutorialBlogBatchPageDescription/>
        case 4:
            return <TutorialBlogDeletePageDescription/>
        default:
            return <></>
        }
    }, [activeStep])

    const handleNext = () => {
        if (activeStep === 4) {
            props.onStepOverflow()
        } else {
            setActiveStep((prevActiveStep) => prevActiveStep + 1)
        }
    }

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1)
    }

    return <TutorialComponent
        length={5}
        currentStep={activeStep}
        handleNext={handleNext}
        handleBack={handleBack}
        disableBackButton={activeStep === 0}
        disableNextButton={false}
    >
        {
            getDescription()
        }
    </TutorialComponent>
})
