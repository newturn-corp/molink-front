import { ButtonGroup, Button } from '@material-ui/core'
import React from 'react'
import GlobalManager from '../../manager/GlobalManager'
import RoutingManager, { Page } from '../../manager/RoutingManager'

enum SettingLocation {
    Profile = 'profile',
    Follow = 'follow',
    DocumentList = 'document-list',
    Subscribe = 'subscribe',
    Wiki = 'wiki'
}

interface SettingButtonProps {
    buttonText: string,
    location: SettingLocation,
    isDisabled: boolean
}

const handleSettingButtonDown = (location: SettingLocation, selected: boolean) => {
    if (selected) {
        return
    }
    switch (location) {
    case SettingLocation.Profile:
        return RoutingManager.moveTo(Page.SettingProfile)
    case SettingLocation.Follow:
        return RoutingManager.moveTo(Page.SettingFollow)
    case SettingLocation.DocumentList:
        return RoutingManager.moveTo(Page.SettingDocumentList)
    }
}

const SettingButton: React.FC<SettingButtonProps> = ({ location, isDisabled, buttonText }) => {
    const arr = GlobalManager.window.location.pathname.split('/')
    const currentSettingLocation = arr[arr.length - 1]
    const selected = currentSettingLocation === location
    return <Button className={`MuiButtonBase-root MuiButton-root MuiButton-outlined MuiButtonGroup-grouped MuiButtonGroup-groupedVertical MuiButtonGroup-groupedOutlined MuiButtonGroup-groupedOutlinedVertical MuiButtonGroup-groupedOutlined${selected ? ' selected-setting-button' : ''}`}
        onClick={() => handleSettingButtonDown(location, selected)}
        disabled={isDisabled}>
        {buttonText}
    </Button>
}

const buttonPropsList: SettingButtonProps[] =
    [
        {
            buttonText: '프로필',
            location: SettingLocation.Profile,
            isDisabled: false
        },
        {
            buttonText: '팔로우 & 팔로잉',
            location: SettingLocation.Follow,
            isDisabled: false
        },
        {
            buttonText: '문서 목록',
            location: SettingLocation.DocumentList,
            isDisabled: false
        },
        {
            buttonText: '구독',
            location: SettingLocation.Subscribe,
            isDisabled: true
        },
        {
            buttonText: '위키',
            location: SettingLocation.Wiki,
            isDisabled: true
        }
    ]

export const SettingButtonList: React.FC<{
  }> = () => {
      return <ButtonGroup
          orientation="vertical"
          className='search-buttons'
          aria-label="vertical outlined primary button group"
      >
          {
              // eslint-disable-next-line react/prop-types
              buttonPropsList.map(props => <SettingButton key={`setting-button-${props.location}`} { ...props } />)
          }
      </ButtonGroup>
  }
