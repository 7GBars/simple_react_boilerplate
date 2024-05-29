import React, {FC} from 'react';


type TFileLoaderWithPreviewProps = {
  file: File;
  dataURL: string;
};

export const FilePreview: FC<TFileLoaderWithPreviewProps> = props => {
  return (
    <div>
      <img src={props.dataURL}/>
    </div>
  );
};


