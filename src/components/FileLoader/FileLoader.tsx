import React, {FC} from 'react';
import {FileReaderUtil} from "../../utils/index";
import {useState} from "react";

const imageMimeType = /image\/(png|jpg|jpeg)/i;
type TFileLoaderProps = {

};

export const FileLoader: FC<TFileLoaderProps> = props => {
  const [currentFile, setCurrentFile] = useState<File | undefined>(undefined);
  const onFileChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [file] = Array.from(e.target.files);

    console.log(file);

    if (file.type.match(imageMimeType)) {
      setCurrentFile(file)
    }
  }

  return (
    <input
      id="file"
      type="file"
      accept=".png, .jpg, .jpeg"

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


