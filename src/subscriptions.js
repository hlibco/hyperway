import convert from 'regexparam'

import { NAVIGATE_EVENT } from './helpers'

let setupRouter = (dispatch, props) => {
    let routes = props.routes.map(r => ({ ...r, ...convert(r.path) }))
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

                    if (currentRoute.onLeave) {
                        dispatch(currentRoute.onLeave, { path: currentRoute.path, params: currentRoute.params })
                    }

                    if (props.onRoute) {
                        dispatch(props.onRoute, { path: route.path, params })
                    }

                    currentRoute = { ...route, params }

                    if (currentRoute.onEnter) {
                        dispatch(currentRoute.onEnter, { path: currentRoute.path, params: currentRoute.params })
                    }
                    return
                }
            }
            if (props.onNotFound) dispatch(props.onNotFound, path)
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

export let Hyperway = props => [setupRouter, props]