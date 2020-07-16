import { emitEvent, NAVIGATE_EVENT } from './helpers'

let emitNavigateEvent = (_, { path, replace, event: e }) => {
    if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || e.button || e.defaultPrevented) return
    e.preventDefault()
    emitEvent(NAVIGATE_EVENT, { path, replace })
}

export let routeTo = (to = '/', replace = false) => (state, event) => [
    state,
    [
        emitNavigateEvent,
        { path: to, replace, event }
    ]
]