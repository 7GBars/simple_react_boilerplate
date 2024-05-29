import React, {FC} from 'react';
import {FileReaderUtil} from "../../utils/index";


type TFileLoaderProps = {

};

export const FileLoader: FC<TFileLoaderProps> = props => {
  return (
    <input
      id="file"
      type="file"
      accept="image/*"
      multiple
      onChange={(e) => {
        const { files } = e.target
        for (let i = 0; i < files.length; i++) {
          const file = files[i]; // OR const file = files.item(i);
          FileReaderUtil(file, 'readAsDataURL');
        }
      }}
    />
  );
};


