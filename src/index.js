import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import reportWebVitals from './reportWebVitals';

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

import Notice from './Component/notice/Notice';
import Search from './Component/search/Search';

ReactDOM.render(
    <React.StrictMode>
        <Router>
            <Routes>
                <Route path="notice" element={<Notice/>}/>
                <Route path="search" element={<Search/>}/>
            </Routes>
        </Router>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
