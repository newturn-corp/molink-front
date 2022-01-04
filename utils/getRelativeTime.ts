import moment from 'moment-timezone'

export const getRelativeTime = (time: Date) => {
    const secondDiff = moment().diff(moment(time), 'second')
    if (secondDiff < 60) {
        return `${secondDiff}초 전`
    } else if (secondDiff < 3600) {
        return `${Math.floor(secondDiff / 60)}분 전`
    } else if (secondDiff < 86400) {
        return `${Math.floor(secondDiff / 3600)}시간 전`
    } else {
        return `${Math.floor(secondDiff / 86400)}일 전`
    }
}
