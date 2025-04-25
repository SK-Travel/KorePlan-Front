import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/KorePlan.css'
import {App} from './App'
import 'bootstrap/dist/css/bootstrap.min.css';
import "react-datepicker/dist/react-datepicker.css";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)