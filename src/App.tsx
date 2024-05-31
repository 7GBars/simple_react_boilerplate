import React, {FC} from 'react';

import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import {Layout, Book, MainPage} from "./pages";



import './app.css';
import './variables/output.css';




const App: FC<{}> = () => {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<MainPage/>} />
          <Route path="book" element={<Book />} />

          <Route path="*" element={<h1> 404 - no content</h1>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
export default App;