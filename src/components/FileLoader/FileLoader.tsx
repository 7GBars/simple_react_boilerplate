import React, {FC, useState} from 'react';

import {FilePreview} from "./FilePreview";
import {useFileReader} from "../../utils/index";

const imageMimeType = /image\/(png|jpg|jpeg)/i;
type TFileLoaderProps = {
  onValueChange: (value: File) => void;
  savedImageFromBD: File | undefined;
};
export const FileLoader: FC<TFileLoaderProps> = props => {
  const [currentFile, setCurrentFile] = useState<File | undefined>(undefined);

  const onFileChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [file] = Array.from(e.target.files as ArrayLike<File>);
    if (file.type.match(imageMimeType)) {
      props.onValueChange(file)
      setCurrentFile(file)
    }
  }

  return (
    <>
      <input
        id="file"
        type="file"
        accept=".png, .jpg, .jpeg"
        onChange={onFileChanged}
      />
      <FilePreview file={props.savedImageFromBD || currentFile} />
    </>
  );
};


