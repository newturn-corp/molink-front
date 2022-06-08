import { makeAutoObservable } from 'mobx'
import ModalManager from './ModalManager'
import ImagePreLoader from './ImagePreLoader'

class TutorialManager {
    key: string = 'blog'
    step: number = 0

    constructor () {
        makeAutoObservable(this)
    }

    get disableBackButton () {
        if (this.key === 'blog' && this.step === 0) {
            return true
        } else {
            return false
        }
    }

    get disableNextButton () {
        if (this.key === 'page-control' && this.step === 2) {
            return true
        } else {
            return false
        }
    }

    openTutorialModal () {
        ModalManager.openTutorialModal = true
        ImagePreLoader.preloadTutorialImage()
    }

    handleNextButtonDown () {
        if (this.key === 'blog' && this.step === 4) {
            this.key = 'editing'
            this.step = 0
            return
        } else if (this.key === 'editing' && this.step === 2) {
            this.key = 'page-control'
            this.step = 0
            return
        } else if (this.key === 'page-control' && this.step === 2) {
            return
        }
        this.step += 1
    }

    handleBackButtonDown () {
        if (this.key === 'blog' && this.step === 0) {
            return
        } else if (this.key === 'editing' && this.step === 0) {
            this.key = 'blog'
            this.step = 4
            return
        } else if (this.key === 'page-control' && this.step === 0) {
            this.key = 'editing'
            this.step = 2
            return
        }
        this.step -= 1
    }

    handleClose () {
        this.step = 0
        this.key = 'blog'
        ModalManager.openTutorialModal = false
    }
}
export default new TutorialManager()
