/**
 * Redux Store Configuration
 *
 * Simple Redux store managing global application state.
 * Handles sidebar visibility and theme preferences.
 *
 * @module store
 */

import { legacy_createStore as createStore } from 'redux'

/**
 * Initial state for the Redux store
 * @type {Object}
 * @property {boolean} sidebarShow - Controls sidebar visibility (true = visible, false = hidden)
 * @property {string} theme - Current theme mode ('light', 'dark', or 'auto')
 */
interface State {
  sidebarShow: boolean
  theme: string
}

interface Action {
  type: string
  [key: string]: any
}

const initialState: State = {
  sidebarShow: true,
  theme: 'light',
}

/**
 * Root reducer function that handles all state changes
 *
 * @param {State} state - Current state (defaults to initialState)
 * @param {Action} action - Action object with type and payload
 * @returns {State} New state object
 */
const changeState = (state = initialState, { type, ...rest }: Action): State => {
  switch (type) {
    case 'set':
      return { ...state, ...rest }
    default:
      return state
  }
}

/**
 * Redux store instance
 */
const store = createStore(changeState)
export default store
export type { State }

