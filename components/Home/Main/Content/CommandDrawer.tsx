import React from 'react'
import { observer } from 'mobx-react'
import { MobileColumnDrawer } from '../../../utils/MobileColumeDrawer/MobileColumnDrawer'
import CommandManager from '../../../../manager/Editing/Command/CommandManager'
import Command from '../../../../manager/Editing/Command/Command'
import CommandGroup from '../../../../manager/Editing/Command/CommandGroup'
import { MobileColumnDrawerGroup } from '../../../utils/MobileColumeDrawer/MobileColumnDrawerGroup'
import EditorManager from '../../../../manager/Blog/EditorManager'
import LanguageManager from '../../../../manager/global/LanguageManager'

export const CommandDrawer: React.FC<{
}> = observer(() => {
    return (
        <MobileColumnDrawer
            className={'command-drawer'}
            open={CommandManager.isCommandDrawerOpen}
            onClose={() => {
                CommandManager.isCommandDrawerOpen = false
            }}
            backgroundColor={'#FAFAFB'}
            title={LanguageManager.languageMap.AddSomething}
        >
            {
                CommandManager.commandGroupList.map((group, groupIndex) => {
                    return <MobileColumnDrawerGroup
                        key={`command-drawer-group-${groupIndex}`}
                    >
                        <div
                            key={`command-drawer-group-name-${group.name}`}
                            className={'group-name'}
                        >{group.name}</div>
                        {
                            group.commands.map((command) => {
                                return <div
                                    id={`command-drawer-${command.name}`}
                                    key={`command-drawer-${command.name}`}
                                    className={'command-drawer-command-block'}
                                    onClick={() => {
                                        CommandManager.insertNodeByCommand(EditorManager.slateEditor, command)
                                        CommandManager.isCommandDrawerOpen = false
                                    }}
                                >
                                    <div className={'container'}>
                                        {
                                            command.imgType === 'img'
                                                ? <img
                                                    key={`command-block-img-${command.name}`}
                                                    className='command-img'
                                                    src={command.imgSrc as string}
                                                />
                                                : <div
                                                    className='command-img'
                                                >
                                                    {command.imgSrc}
                                                </div>
                                        }
                                        <div
                                            key={`command-block-text-container${command.name}`}
                                            className='text-container'
                                        >
                                            <p
                                                key={`command-block-name-${command.name}`}
                                                className='name'
                                            >
                                                {command.name}
                                            </p>
                                            <p
                                                key={`command-block-description-${command.name}`}
                                                className='description'
                                            >
                                                {command.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            })
                        }
                    </MobileColumnDrawerGroup>
                })
            }
        </MobileColumnDrawer>
    )
})
