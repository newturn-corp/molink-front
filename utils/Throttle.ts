export const Throttle = (ms: number = 0) => {
    return (target : any, propertyKey : string, descriptor: PropertyDescriptor) => {
        const callback = descriptor.value
        let runTime!: any
        let isrunning: boolean = false
        let lastArgs: any = null
        descriptor.value = function (...args: any[]) {
            if (!isrunning) {
                callback.apply(this, args)
                clearTimeout(runTime)
                isrunning = true
                runTime = setTimeout(() => {
                    isrunning = false
                    if (lastArgs) {
                        callback.apply(this, lastArgs)
                        lastArgs = null
                    }
                }, ms)
            } else {
                lastArgs = args
            }
        }
        // descriptor.value = (prop: unknown) => {
        //     callback.bind(this)
        //     if (!isrunning) {
        //         callback(prop)
        //         clearTimeout(runTime)
        //         isrunning = true
        //         runTime = setTimeout(() => {
        //             isrunning = false
        //         }, ms)
        //     }
        // }
    }
}
