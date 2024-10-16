import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
const SITE_KEY = '6LcpeVQqAAAAACczaEFPePOgStVqHCBzGzUy_OF8';
root.render(
  <React.StrictMode>
     <GoogleReCaptchaProvider reCaptchaKey={SITE_KEY}>
      <App />
    </GoogleReCaptchaProvider>
  </React.StrictMode>
);


