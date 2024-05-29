import React, {FC, useState} from 'react';

import {FilePreview} from "./FilePreview";

const imageMimeType = /image\/(png|jpg|jpeg)/i;
type TFileLoaderProps = {

};
export const FileLoader: FC<TFileLoaderProps> = props => {
  const [currentFile, setCurrentFile] = useState<File | undefined>(undefined);
  const [fileDataURL, setFileDataURL] = useState(null);
  const onFileChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [file] = Array.from(e.target.files);
    if (file.type.match(imageMimeType)) {
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
      <FilePreview file={currentFile} />
    </>
  );
};


