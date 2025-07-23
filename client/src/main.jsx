import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import React from 'react'
import './index.css'
import App from './App.jsx'
import { persistor, store } from './redux/store.js'
import {Provider} from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import axios from 'axios'

// Configure axios to send cookies with all requests
axios.defaults.withCredentials = true;

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
    <App />
    </PersistGate>
  </Provider>,
)
