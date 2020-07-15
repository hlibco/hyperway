export let NAVIGATE_EVENT = 'hyperway-navigate'

export let emitEvent = (name, detail) => {
    let event = new CustomEvent(name, { detail })
    dispatchEvent(event)
}