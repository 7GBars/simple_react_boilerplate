import React, {FC} from 'react';
import {Button} from "lib2_geo_bars/Button";
import {Logo} from "lib2_geo_bars/Logo";

import './main.scss';
import {Test} from "../components/Test";
import {useState} from "react";
import {BigImg} from "lib2_geo_bars/BigImg";


type TMainProps = {

};

export const Main: FC<TMainProps> = props => {
  const [id, setId] = useState(0)

  debugger
  return (
    <>
      <h1>as</h1>
      <Test someProps={id} handler={setId}/>
      <Logo/>
      <BigImg/>
      <Button>as</Button>
    </>
  );
};


