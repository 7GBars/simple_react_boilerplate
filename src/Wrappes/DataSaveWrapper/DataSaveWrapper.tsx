import React, {FC} from 'react';


type TDataSaveWrapperProps = {

};

export const DataSaveWrapper: FC<TDataSaveWrapperProps> = props => {
  return (
    <div>
      {props.children}
    </div>
  );
};


