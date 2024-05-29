import React, {FC} from 'react';
import {useFileReader} from "../../utils/index";
import './FilePreview.scss';

type TFileLoaderWithPreviewProps = {
  file: File;
};
export const FilePreview: FC<TFileLoaderWithPreviewProps> = props => {
  const {fileDataURL} = useFileReader(props.file, 'readAsDataURL');

  return (
    <div className={'img-preview-wrapper'}>
      <img src={fileDataURL}/>
    </div>
  );
};


