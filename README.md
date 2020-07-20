# Hyperway
 
## Install

`npm i -S hyperway`

## Usage

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <script type="module">
        import { h, text, app } from "https://unpkg.com/hyperapp"
        import { Hyperway, routeTo } from 'https://unpkg.com/hyperway'

        // Your custom components
        let Link = ({ to }, t) => h('a', { onclick: routeTo(to) }, [text(t),h('br',{})])
        let SampleComponent = () => h('div', { }, text('Sample component'))
        let PageNotFoundComponent = () => h('div', { }, text('Page not found'))

        // Hyperway configuration with your route definitions
        let hyperway = {
            routes: {
                // Basic route
                '/': SampleComponent,

                // Route with params
                '/users/:id': SampleComponent,

                // Route with optional params (use ? after the param)
                '/users/:id/:action?': SampleComponent,

                // Route with wildcard
                '/public/*': SampleComponent,

                // Route with optional hooks (onEnter and onLeave)
                '/about': {
                    // required
                    component: SampleComponent,
                    // optional
                    onEnter: (state, props) => {
                        console.log('enter /about', props)
                        return state
                    },
                    // optional
                    onLeave: (state, props) => {
                        console.log('leave /about', props)
                        return state
                    }
                },

                // Page not found
                '*': PageNotFoundComponent
            },

            // Executed before the onEnter hook of each route (optional)
            onEnter: (state, props) => {
                console.log('global enter', props)
                return { ...state, url: props.path, params: props.params }
            },

            // Executed before the onLeave hook of each route (optional)
            onLeave: (state, props) => {
                console.log('global leave', props)
                return { ...state, url: props.path, params: props.params }
            },
        }

        app({
            init: {
                // Router is the key in the state where Hyperway will operate on.
                // If you change the name, remember to update the subscription.
                router: Hyperway.init(hyperway)
            },
            view: state => h('div', {}, [
                Link({ to: '/' }, 'Go to /'),
                Link({ to: '/users/123/delete' }, 'Go to /users/123/delete'),
                Link({ to: '/users/123' }, 'Go to /users/123'),
                Link({ to: '/public/img/logo.png' }, 'Go to /public/img/logo.png'),
                h('div', {}, [text(`You are on "${state.url}" and params are ${JSON.stringify(state.params)}`)]),
                h('hr',{}),

                // Render the view for each route
                state.router.view(state)
            ]),
            subscriptions: state => [
                // If you change the key "router" in the "init", remember to change it in the reducer below.
                Hyperway.subscribe(
                    (router) => (state) => ({ ...state, router }),
                    hyperway
                )
            ],
            node: document.getElementById('app')
        })
    </script>
</head>

<body>
    <main id="app"></main>
</body>

</html>
```
