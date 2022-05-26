import moment from 'moment-timezone'

export const getRelativeTime = (time: Date, showDate: boolean = false) => {
    const secondDiff = moment().diff(moment(time), 'second')
    if (secondDiff < 60) {
        return `${secondDiff}초 전`
    } else if (secondDiff < 3600) {
        return `${Math.floor(secondDiff / 60)}분 전`
    } else if (secondDiff < 86400) {
        return `${Math.floor(secondDiff / 3600)}시간 전`
    }
    if (showDate) {
        if (secondDiff < 604800) {
            return `${Math.floor(secondDiff / 86400)}일 전`
        } else {
            return moment(time).format('YYYY.MM.DD HH:mm')
        }
    } else {
        return `${Math.floor(secondDiff / 86400)}일 전`
    }
}
