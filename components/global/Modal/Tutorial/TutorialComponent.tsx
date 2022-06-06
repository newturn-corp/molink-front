import React from 'react'
import { observer } from 'mobx-react'
import { Button, MobileStepper } from '@material-ui/core'
import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons'

export const TutorialComponent: React.FC<{
    length: number,
    currentStep: number,
    handleNext: React.MouseEventHandler<HTMLButtonElement>,
    handleBack: React.MouseEventHandler<HTMLButtonElement>,
    disableNextButton: boolean,
    disableBackButton: boolean
}> = observer(({ length, children, handleBack, handleNext, disableNextButton, disableBackButton, currentStep }) => {
    return <div>
        {
            children
        }
        <MobileStepper
            variant="dots"
            steps={length}
            position="static"
            style={{
                backgroundColor: 'transparent'
            }}
            activeStep={currentStep}
            nextButton={
                <Button size="small" onClick={handleNext} disabled={disableNextButton}>
                    <KeyboardArrowRight />
                </Button>
            }
            backButton={
                <Button size="small" onClick={handleBack} disabled={disableBackButton}>
                    <KeyboardArrowLeft />
                </Button>
            }
        />
    </div>
})
