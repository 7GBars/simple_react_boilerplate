import React, {FC} from 'react';
import {Button} from "lib2_geo_bars/Button";
import {Logo} from "lib2_geo_bars/Logo";

import './main.scss';
import {Test} from "../components/Test/Test";
import {useState} from "react";
import {BigImg} from "lib2_geo_bars/BigImg";
import {FileLoader} from "../components/index";


type TMainProps = {

};

export const Main: FC<TMainProps> = props => {
  const [id, setId] = useState(0)

  return (
    <>
     <FileLoader/>
    </>
  );
};


