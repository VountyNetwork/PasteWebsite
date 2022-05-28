import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import ContentView from './views/ContentView.tsx';

import {
  Route,
  Routes
} from "react-router-dom";

import { 
  BrowserRouter 
} from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<ContentView />}>
        <Route path=":targetId" element={<ContentView />}></Route>
      </Route>
    </Routes>
  </BrowserRouter>
);