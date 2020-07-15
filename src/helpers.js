export let NAVIGATE_EVENT = 'hyperway-navigate'

export let emitEvent = (name, detail) => {
    let event = new CustomEvent(name, { detail })
    dispatchEvent(event)
}

export let addHistoryEvent = type => {
    if (history[type]) return
    history[type] = type
    let fn = history[type += 'State']
    history[type] = function (state, title, uri) {
        fn.apply(this, arguments)
        emitEvent(type.toLowerCase(), { state, title, uri })
    }
}