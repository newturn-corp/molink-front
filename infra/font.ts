export const getFontSizeByDepth = (depth: number) => {
    switch (depth) {
    case 0:
        return '2rem'
    case 1:
        return '1.125rem'
    }
}
export const getFontWeightByDepth = (depth: number) => {
    switch (depth) {
    case 0:
        return 600
    case 1:
        return 400
    }
}
export const getTextStyleByDepth = (depth: number) => {
    switch (depth) {
    case 0:
        return {
            fontSize: '2rem',
            fontWeight: 600,
            lineHeight: 1.5,
            marginTop: '1rem',
            marginBottom: '1rem'
        }
    case 1:
        return {
            fontSize: '1.125rem',
            fontWeight: 400,
            marginTop: '0',
            marginBottom: '0.5rem'
        }
    case 2:
        return {
            fontSize: '1rem',
            fontWeight: 400,
            marginTop: '0',
            marginBottom: '0.5rem'
        }
    case 3:
        return {
            fontSize: '0.8rem',
            fontWeight: 400,
            marginTop: '0',
            marginBottom: '0.5rem'
        }
    case 4:
        return {
            fontSize: '0.6rem',
            fontWeight: 400,
            marginTop: '0',
            marginBottom: '0.5rem'
        }
    }
}
