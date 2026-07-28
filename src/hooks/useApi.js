import { useState, useEffect, useRef, useCallback } from 'react'
import api from '../api/axiosClient'

const cache = new Map()

export default function useApi(url, config = {}, options = {}) {
  const { dedupe = true, deps = [] } = options
  const cacheKey = `${url}|${JSON.stringify(deps)}`
  const [data, setData] = useState(() => (dedupe && cache.has(cacheKey) ? cache.get(cacheKey) : null))
  const [loading, setLoading] = useState(() => !(dedupe && cache.has(cacheKey)))
  const [error, setError] = useState(null)
  const controllerRef = useRef(null)

  useEffect(() => {
    let mounted = true
    if (dedupe && cache.has(cacheKey)) {
      setData(cache.get(cacheKey))
      setLoading(false)
      return
    }

    controllerRef.current = new AbortController()
    setLoading(true)
    setError(null)

    api
      .get(url, { signal: controllerRef.current.signal, headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache' }, ...config })
      .then((res) => {
        const respData = Array.isArray(res.data) ? res.data : res.data?.users || res.data
        if (!mounted) return
        if (dedupe) cache.set(cacheKey, respData)
        setData(respData)
      })
      .catch((err) => {
        if (!mounted) return
        if (err.name === 'CanceledError' || err.message === 'canceled') return
        setError(err)
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => {
      mounted = false
      controllerRef.current?.abort()
    }
  }, [url, dedupe, cacheKey])

  const refetch = useCallback(async () => {
    controllerRef.current?.abort()
    controllerRef.current = new AbortController()
    setLoading(true)
    setError(null)
    try {
      const res = await api.get(url, { signal: controllerRef.current.signal, headers: { 'Cache-Control': 'no-cache' }, ...config })
      const respData = Array.isArray(res.data) ? res.data : res.data?.users || res.data
      if (dedupe) cache.set(cacheKey, respData)
      setData(respData)
      return respData
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [url, config, dedupe, cacheKey])

  return { data, loading, error, refetch }
}
