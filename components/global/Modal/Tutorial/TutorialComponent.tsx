import React from 'react'
import { observer } from 'mobx-react'
import { Button, MobileStepper } from '@material-ui/core'
import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons'
import TutorialManager from '../../../../manager/global/TutorialManager'

export const TutorialComponent: React.FC<{
    length: number
}> = observer(({ length, children }) => {
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
            activeStep={TutorialManager.step}
            nextButton={
                <Button
                    size="small"
                    onClick={() => TutorialManager.handleNextButtonDown()}
                    disabled={TutorialManager.disableNextButton}
                >
                    <KeyboardArrowRight />
                </Button>
            }
            backButton={
                <Button
                    size="small"
                    onClick={() => TutorialManager.handleBackButtonDown()}
                    disabled={TutorialManager.disableBackButton}
                >
                    <KeyboardArrowLeft />
                </Button>
            }
        />
    </div>
})
