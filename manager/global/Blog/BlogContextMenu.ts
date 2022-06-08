import GlobalManager from '../GlobalManager'
import {
    ChangePageNameOption,
    CreateNewPageOption,
    DeletePageOption,
    HierarchyControlOption
} from '../Hierarchy/HierarchyOptions'
import { makeAutoObservable } from 'mobx'
import EventManager from '../Event/EventManager'
import { Event } from '../Event/Event'

export class BlogContextMenu {
    public availControlOptions: HierarchyControlOption[] = []
    public isOpen: boolean = false
    public clickPosition: { x: number, y: number } = { x: 0, y: 0 }
    public selectedPageId: string

    constructor () {
        makeAutoObservable(this)
        EventManager.addEventListener(Event.PageBodyClick, () => {
            this.close()
        }, 1)
    }

    public open (pageId: string | null) {
        this.initAvailControlOptions(pageId)

        this.isOpen = true
        this.clickPosition = {
            x: GlobalManager.mousePositionX,
            y: GlobalManager.mousePositionY
        }
    }

    public close () {
        this.isOpen = false
    }

    public initAvailControlOptions (pageId: string | null) {
        this.selectedPageId = pageId
        this.availControlOptions = []
        this.availControlOptions.push(new CreateNewPageOption(pageId))
        if (pageId) {
            this.availControlOptions.push(new ChangePageNameOption(pageId))
            this.availControlOptions.push(new DeletePageOption(pageId))
        }
    }
}
