import React from 'react';
import './index.css';
import ReactDOM from 'react-dom';
import App from './components/App/App';
import reportWebVitals from './reportWebVitals';

const setVH = () => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
};

// Call the function initially
setVH();

// Update the variable whenever the window is resized or the orientation changes
window.addEventListener('resize', setVH);
window.addEventListener('orientationchange', setVH);

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
