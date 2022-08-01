import React, { useCallback, useEffect, useMemo, useState } from "react"
import { Awaited } from "../util"

type Callback = (...args: any) => Promise<any>
type CancellablePromise<T = any> = PromiseLike<T> & { cancel: () => void }
type Option<T extends Callback> = {
    defaultValue?: any,
    // 函数参数
    payload?: Parameters<T>,
    // 立即执行
    immediate?: boolean
}

const REASON = "abort in useHttp"

function createAborter() {
    return new Promise(resolve => {
        promise.cancel = resolve.bind(null, REASON)
    }) as CancellablePromise
}


export default function useHttp<T extends Callback>(executor: T, option?: Option<T>, deps?: any[]) {
    const $option: Option<T> & { executor: T } = useMemo(() => ({
        immediate: true,
        ...option,
        executor
    }), [executor, option])
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState(option?.defaultValue)
    const [error, setError] = useState(null)
    const [empty, setEmpty] = useState(false)

    const handle: CancellablePromise = useCallback(() => {
        let aborter = createAborter()
        setLoading(true)
        const promise: CancellablePromise = Promise.race([$option.executor($option.payload), aborter])
            .then(([data, err]) => {
                if (err === REASON) return setEmpty(true)
                setData(data)
                setError(null)
                setEmpty(typeof data === 'object' ? Object.keys(data).length === 0 : false)
                return res
            })
            .catch(err => {
                setData($option.defaultValue)
                setError(err)
                setEmpty(true)
                return Promise.reject(err)
            })
            .finally(() => {
                aborter.cancel()
                aborter = null
                setLoading(false)
            })
        promise.cancel = aborter.cancel
        return promise
    }, deps)

    useEffect(() => {
        if ($option.immediate) {
            handle()
        }
        return handle?.cancel
    }, [deps])
    return {
        loading,
        data,
        error,
        handle,
        empty
    }
}