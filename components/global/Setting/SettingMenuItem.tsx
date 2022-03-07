import React, { useRef, useState } from 'react'
import { observer } from 'mobx-react'
import ListItem from '@material-ui/core/ListItem'
import { Collapse, List } from '@material-ui/core'
import { SettingChildrenOpenButton } from './SettingChildrenOpenButton'
import SettingManager from '../../../manager/global/Setting/SettingManager'

let ghost
export const SettingMenuItem: React.FC<{
    settingID: string,
    depth: number
}> = observer(({
    settingID,
    depth
}) => {
    const [isMouseOver, setIsMouseOver] = useState(false)
    const divRef = useRef<HTMLDivElement>(null)
    const padding = 4 + depth * 12
    const setting = SettingManager.settingMap.get(settingID)

    return (
        <>
            <ListItem
                id={`setting-${settingID}`}
                key={`setting-${settingID}`}
                button
                ref={divRef}
                style={{
                    padding: 0,
                    paddingLeft: padding,
                    marginRight: 5,
                    borderRadius: 10,
                    marginLeft: 8,
                    width: 'inherit'
                }}
                onMouseOver={() => setIsMouseOver(true)}
                onMouseLeave={() => setIsMouseOver(false)}
            >
                <SettingChildrenOpenButton
                    settingID={settingID}
                    key={`setting-children-open-${settingID}`}
                />
                <div
                    spellCheck={false}
                >{setting.name}</div>
            </ListItem>
            <Collapse in={setting.isChildrenOpen} timeout="auto" unmountOnExit>
                <List
                    id={`setting-child-list-${settingID}`}
                    component="div"
                    disablePadding
                >
                    {
                        setting.children.map(childSettingID => {
                            return <SettingMenuItem
                                key={Math.random()}
                                settingID={settingID}
                                depth={depth + 1}
                            />
                        })
                    }
                </List>
            </Collapse>
        </>
    )
})
