import React, {FC} from 'react';


type TFileLoaderProps = {

};

export const FileLoader: FC<TFileLoaderProps> = props => {
  return (
    <input type="file" accept="image/*" multiple/>
  );
};


