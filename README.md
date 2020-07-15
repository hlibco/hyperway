# Hyperway
 
## Install

`npm i -S hyperway`

## Usage

```js
import { h, text, app } from "https://unpkg.com/hyperapp"
import { Hyperway, handleLinkClick } from 'https://unpkg.com/hyperway'

app({
    init: {},
    view: state => h('div', { onclick: handleLinkClick('/users/123/delete') }, text('Click here')),
    subscriptions: state => [
        // just one subscription
        Hyperway({
            // called if not path found (optional)
            onNotFound: (state, props) => {
                console.log('NOT FOUND', state, props)
                return state
            },
            // called on every path change (optional)
            onRoute: (state, props) => {
                console.log('ROUTE', state, props)
                return state
            },
            routes: [
                {
                    // page path (required)
                    path: '/',
                    // optional
                    onEnter: (state, props) => {
                        console.log('enter /', props)
                        return state
                    },
                    // optional
                    onLeave: (state, props) => {
                        console.log('leave /', props)
                        return state
                    }
                },
                {
                    // path with params
                    path: '/users/:id/:action',
                    onEnter: (state, props) => {
                        console.log('"id" and "action" are required', props.params)
                        return state
                    }
                },
                {
                    // optional param
                    path: '/users/:id/:action?',
                    onEnter: (state, props) => {
                        console.log('required "id" and optional "action"', props.params)
                        return state
                    }
                },
                {
                    // wildcard
                    path: '/public/*',
                    onEnter: (state, props) => {
                        console.log('wildcard', props.params)
                        return state
                    }
                }
            ]
        })
    ],
    node: document.getElementById('app')
})
```