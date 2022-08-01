import React,{useCallback,useEffect,useMemo,useState} from "react"
import {Awaited} from "../util"
const REASON = "abort by race in useHttp"

function createAborter(){
    
}

export default function useHttp() {
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState(null)
    const [error, setError] = useState(null)


    return {
        loading,
        data,
        error
    }
}