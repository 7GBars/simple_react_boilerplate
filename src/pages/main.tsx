import React, {FC} from 'react';
import {Button} from "lib2_geo_bars/Button";
import {GridBlock} from "lib2_geo_bars/GridBlock";
import './main.scss';



type TMainProps = {

};

export const Main: FC<TMainProps> = props => {
  return (
    <>
      <h1>as</h1>
      <GridBlock/>
      <Button>as</Button>
    </>
  );
};


