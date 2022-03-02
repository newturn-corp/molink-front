import { observer } from 'mobx-react'
import React, { useState } from 'react'
// import { ListItem, ListItemAvatar, Avatar, ListItemText, CircularProgress } from '@material-ui/core'
// import SearchManager from '../../manager/global/SearchManager'
// import { FollowResult, UserSearchResultDTO } from '../../DTO/UserDTO'
//
// const FollowButton: React.FC<{
//     searchResult: UserSearchResultDTO
// }> = ({ searchResult }) => {
//     // const [followResult, setFollowResult] = useState(null)
//     // const [isLoading, setIsLoading] = useState(false)
//     // if (UserManager.profile.userId === searchResult.id) {
//     //     return <></>
//     // }
//     // if (searchResult.isFollowing) {
//     //     return <></>
//     // }
//     //
//     // const handleFollowButtonClick = async (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
//     //     event.stopPropagation()
//     //     if (isLoading) {
//     //         return
//     //     }
//     //     setIsLoading(true)
//     //     setFollowResult(await UserManager.follow(searchResult.id))
//     //     setIsLoading(false)
//     // }
//     //
//     // if (isLoading) {
//     //     return <CircularProgress size={20} ></CircularProgress>
//     // }
//     //
//     // if (searchResult.isFollowRequested) {
//     //     return <div className='follow-button requested no-select'>요청됨</div>
//     // }
//     //
//     // if (followResult) {
//     //     if (followResult === FollowResult.Succeeded) {
//     //         return <div className='follow-button requested no-select'>팔로잉</div>
//     //     } else {
//     //         return <div className='follow-button requested no-select'>요청됨</div>
//     //     }
//     // } else {
//     //     return <div
//     //         className='follow-button'
//     //         onClick={(event) => handleFollowButtonClick(event)}>팔로우</div>
//     // }
// }
//
export const UserSearchResult: React.FC<{

}> = observer(() => {
    // const profileImageSrc = result.profileImageUrl || undefined
    // const profileInnerText = result.profileImageUrl ? undefined : result.nickname[0]
    //
    // const handleClick = () => {
    //     SearchManager.moveBySearchResult(result.id)
    // }
    //
    // return <ListItem alignItems="flex-start" className='user-search-result'>
    //     <ListItemAvatar>
    //         <Avatar
    //             className='avatar'
    //             sizes='40'
    //             src={profileImageSrc}
    //             onClick={() => handleClick()}
    //         >{profileInnerText}</Avatar>
    //     </ListItemAvatar>
    //     <ListItemText
    //         primary={<React.Fragment>
    //             {result.nickname}
    //         </React.Fragment>}
    //         secondary={
    //             <React.Fragment>
    //                 {result.biography}
    //             </React.Fragment>
    //         }
    //     />
    //     <FollowButton searchResult={result}></FollowButton>
    // </ListItem>
    return <div></div>
})
