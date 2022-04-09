import React from 'react'
import { observer } from 'mobx-react'
import Drawer from '@material-ui/core/Drawer'
import { makeStyles } from '@material-ui/core/styles'
import { MobileColumnDrawerTitle } from './MobileColumnDrawerTitle'

export interface MobileColumnDrawerInterface {
    className: string,
    open: boolean,
    onClose: Function,
    backgroundColor: string,
    title: string
}

export const MobileColumnDrawer: React.FC<MobileColumnDrawerInterface> = observer((props) => {
    const useStyles = makeStyles({
        paper: {
            height: '100%',
            backgroundColor: props.backgroundColor
        }
    })
    const classes = useStyles()
    return (
        <Drawer
            className={'mobile-column-drawer' + (props.className ? ` ${props.className}` : '')}
            variant={'temporary'}
            anchor={'bottom'}
            open={props.open}
            onClose={() => props.onClose()}
            classes={classes}
        >
            <MobileColumnDrawerTitle
                title={props.title}
                onClose={() => props.onClose()}
            />
            <div
                className={'body'}
            >
                {props.children}
            </div>
        </Drawer>
    )
})
