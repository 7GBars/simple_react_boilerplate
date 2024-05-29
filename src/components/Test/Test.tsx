import React, {FC} from 'react';


type TTestProps = {
  someProps: number;
  handler: any;
};

export const Test: FC<TTestProps> = props => {
  debugger
  return (
    <div>

      <button onClick={(e) => {
        debugger
        props.handler((i: any) => ++i);
      }}>count up</button>
    </div>
  );
};


