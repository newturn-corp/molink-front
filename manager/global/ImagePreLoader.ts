const tutorialImageList = [
    'https://knowlink-development-content-image.s3.ap-northeast-2.amazonaws.com/ezgif-1-5e8dc97031.gif',
    'https://knowlink-development-content-image.s3.ap-northeast-2.amazonaws.com/ezgif-1-d0b928cd85.gif',
    'https://knowlink-development-content-image.s3.ap-northeast-2.amazonaws.com/ezgif-1-ec826db561.gif',
    'https://knowlink-development-content-image.s3.ap-northeast-2.amazonaws.com/content-image-23051656-717f-4b22-8e29-8ce28ba71b3b.gif',
    'https://knowlink-development-content-image.s3.ap-northeast-2.amazonaws.com/shortcut.PNG',
    'https://knowlink-development-content-image.s3.ap-northeast-2.amazonaws.com/ezgif-2-d8afb0cb5a.gif',
    'https://knowlink-development-content-image.s3.ap-northeast-2.amazonaws.com/content-image-f5ff7d7d-7624-417c-9f9d-c93064617d48.gif',
    'https://knowlink-development-content-image.s3.ap-northeast-2.amazonaws.com/content-image-cca12f9f-55a6-4ace-9816-899728248256.png',
    'https://knowlink-development-content-image.s3.ap-northeast-2.amazonaws.com/content-image-9c436840-862a-471b-97e3-fc4da25d7f14.png',
    'https://knowlink-development-content-image.s3.ap-northeast-2.amazonaws.com/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7(7).png',
    'https://knowlink-development-content-image.s3.ap-northeast-2.amazonaws.com/content-image-78aaa078-b94d-4aa6-b4a3-ccb6b8dd86ea.png',
    'https://knowlink-development-content-image.s3.ap-northeast-2.amazonaws.com/content-image-5aabea9c-1c7a-43ca-a704-c4fb80aeef4b.png'
]

const commandIconList = [
    '/image/editor/command/head1.png',
    '/image/editor/command/head2.png',
    '/image/editor/command/head3.png',
    '/image/editor/command/bullet-list.png',
    '/image/editor/command/ordered-list.png',
    '/image/editor/command/check-list.png',
    '/image/editor/command/divider-default.png'
]

class ImagePreLoader {
    isTutorialImagePreloaded: boolean = false
    isCommandIconPreloaded: boolean = false

    preloadImage (imageArray: string[]) {
        for (let i = 0; i < imageArray.length; i++) {
            const img = new Image()
            img.src = imageArray[i]
        }
    }

    preloadTutorialImage () {
        if (this.isTutorialImagePreloaded) {
            return
        }
        this.preloadImage(tutorialImageList)
        this.isTutorialImagePreloaded = true
    }

    preloadCommandIcon () {
        if (this.isCommandIconPreloaded) {
            return
        }
        this.preloadImage(commandIconList)
        this.isCommandIconPreloaded = true
    }
}
export default new ImagePreLoader()
