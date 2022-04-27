import { useMemo, useState } from "react"
import { useBoolean } from "./use-boolean"

export function useDialog(initialState = false) {
  const [payload, setPayload] = useState()
  const [open, functions] = useBoolean(initialState)

  const openWithPayload = (_payload) => {
    actions.on()
    setPayload(_payload)
  }

  const actions = useMemo(() => ({
    ...functions,
    openWithPayload,
    payload
  }))

  return [open, actions]
}