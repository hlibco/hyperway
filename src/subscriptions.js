import convert from 'regexparam'

import { NAVIGATE_EVENT } from './helpers'

let setupRouter = (dispatch, {reducer, props}) => {
    let routes = Object.entries(props.routes).map((r) => ({
        ...(typeof r[1] === "function" ? { view: r[1] } : {...r[1], view: r[1].component}),
        path: r[0],
        ...convert(r[0])
    }))
    let baseUrl = props.baseUrl || '/'
    let re = baseUrl === '/' ? /^\/+/ : new RegExp('^\\' + baseUrl + '(?=\\/|$)\\/?', 'i')
    let currentRoute = {}
    let currentPath

    let fmt = path => {
        if (!path) return path
        path = '/' + path.replace(/^\/|\/$/g, '')
        return re.test(path) && path.replace(re, '/')
    }

    let routeTo = (path, replace) => {
        if (path[0] === '/' && !re.test(path)) path = baseUrl + path
        history[(path === currentPath || replace ? 'replace' : 'push') + 'State'](path, null, path)
        findRoute()
    }

    let onNavigate = ({ detail }) => routeTo(detail.path, detail.replace)

    let findRoute = () => {
        let i = 0, path = fmt(location.pathname)
        if (path) {
            path = path.match(/[^\?#]*/)[0]
            for (currentPath = path; i < routes.length; i++) {
                let route = routes[i], arr = route.pattern.exec(path)
                if (arr) {
                    let params = {}
                    for (i = 0; i < route.keys.length;) {
                        params[route.keys[i]] = arr[++i] || null;
                    }

                    const nextRoute = { ...route, params }

                    // stop execution if route has not changed
                    if (currentRoute.path === nextRoute.path) {
                        return
                    }

                    // execute onLeave hooks
                    if (props.onLeave) {
                        dispatch(props.onLeave, { path: currentRoute.path, params: currentRoute.params })
                    }
                    if (currentRoute.onLeave) {
                        dispatch(currentRoute.onLeave, { path: currentRoute.path, params: currentRoute.params })
                    }

                    dispatch(reducer(nextRoute));

                    // execute onEnter hooks
                    if (props.onEnter) {
                        dispatch(props.onEnter, { path: nextRoute.path, params: nextRoute.params });
                    }
                    if (nextRoute.onEnter) {
                        dispatch(nextRoute.onEnter, { path: nextRoute.path, params: nextRoute.params })
                    }

                    currentRoute = {...nextRoute};
                    return
                }
            }

            // page not found
            if (props['*']) dispatch(props['*'], path)
        }
    }

    addEventListener(NAVIGATE_EVENT, onNavigate)
    addEventListener('popstate', findRoute)
    setTimeout(() => findRoute(), 0)

    return () => {
        removeEventListener('popstate', findRoute)
        removeEventListener(NAVIGATE_EVENT, onNavigate)
    }
}

export let Hyperway = {
    init: () => ({
        view: function () {}
    }),
    subscribe: (reducer, props) => [setupRouter, { reducer, props }]
}
