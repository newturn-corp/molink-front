import moment from 'moment-timezone'

export const getRelativeTime = (time: Date, showDate: boolean = false, useText: true) => {
    const secondDiff = moment().diff(moment(time), 'second')
    if (secondDiff < 60) {
        if (useText) {
            return '방금'
        } else {
            return `${secondDiff}초 전`
        }
    } else if (secondDiff < 3600) {
        return `${Math.floor(secondDiff / 60)}분 전`
    } else if (secondDiff < 86400) {
        return `${Math.floor(secondDiff / 3600)}시간 전`
    } else if (secondDiff < 172800) {
        return '어제'
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

export const getTimeDiff = (timeA: Date, timeB: Date) => {
    const secondDiff = Math.abs(moment(timeA).diff(moment(timeB), 'second'))
    if (secondDiff < 60) {
        return `${secondDiff}초`
    } else if (secondDiff < 3600) {
        return `${Math.floor(secondDiff / 60)}분`
    } else if (secondDiff < 86400) {
        return `${Math.floor(secondDiff / 3600)}시간`
    } else {
        const day = Math.floor(secondDiff / 86400)
        const hour = Math.floor((secondDiff - day * 86400) / 3600)
        return `${day}일 ${hour}시간`
    }
}
