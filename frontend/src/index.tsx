import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import 'core-js'

import App from './App'
import store from './store'
import { AuthProvider } from './context/AuthContext'

createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider store={store}>
    <AuthProvider>
      <App />
    </AuthProvider>
  </Provider>,
)
