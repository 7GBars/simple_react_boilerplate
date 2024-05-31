import * as React from 'react';
import {FC} from "react";
import {Main} from "./pages";

import './app.css';
import './variables/output.css';
import {Book} from "./pages";



const App: FC<{}> = () => {

  return (
    <>
      <Book/>
    </>

  )
}
export default App;