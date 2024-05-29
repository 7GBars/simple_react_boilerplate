import React, {FC, useState} from 'react';

import {SAVED_FILE_FIELD} from "../constants/index";
import {FileLoader} from "../components/index";

import './main.scss';

type TMainProps = {

};
export const Main: FC<TMainProps> = props => {
  const [id, setId] = useState(0)
  const [savedFile, setSavedFile] = useState(undefined);

  return (
    <>
     <FileLoader/>
      <button onClick={() => {
        const savedFile = localStorage.getItem(SAVED_FILE_FIELD);
        savedFile && setSavedFile(savedFile.toString())
      }}> Показать  </button>

      <img src={savedFile}/>
    </>
  );
};


