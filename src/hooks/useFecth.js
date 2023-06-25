import { useEffect, useState } from "react"
import { fetchApi } from "../functions"

export default function useFetch(url) {
          const [state, setState] = useState({
                    loading: true,
                    items: []
          })
          useEffect(() => {
                    (async () => {
                              try {
                                        const data = await fetchApi(url)
                                        setState({
                                                  loading: false,
                                                  items: data
                                        })
                              } catch (error) {
                                        console.log(error)
                                        setState({
                                                  loading: false,
                                                  items: []
                                        })
                              }
                    })()
          }, [url])
          return [state.loading, state.items, setState]
}