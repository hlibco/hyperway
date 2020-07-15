import { emitEvent, NAVIGATE_EVENT } from './helpers'

export let handleLinkClick = (to = '/', replace = false) => (state, event) => {
    if (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey || event.button || event.defaultPrevented) return state
    event.preventDefault()
    emitEvent(NAVIGATE_EVENT, { path: to, replace })
    return state
}