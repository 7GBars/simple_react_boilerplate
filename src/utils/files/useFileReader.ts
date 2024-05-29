import {useEffect, useState} from "react";
import {SAVED_FILE_FIELD} from "../../constants/index";

type ReadingType = 'readAsDataURL' | 'readAsArrayBuffer' | 'readAsText';
export const useFileReader =  (fileObject: File, type: ReadingType) => {
  const [fileDataURL, setFileDataURL] = useState(null);
  useEffect(() => {
    let fileReader: FileReader, isCancel = false;
    if (fileObject) {
      fileReader =  new FileReader();
      fileReader.onload = (e) => {
        const { result } = e.target;
        if (result && !isCancel) {
          setFileDataURL(result)
         localStorage.setItem(SAVED_FILE_FIELD, result as string);
        }
      }
      fileReader[type](fileObject);
    }
    return () => {
      isCancel = true;
      if (fileReader && fileReader.readyState === 1) {
        fileReader.abort();
      }
    }

  }, [fileObject]);

  return { fileDataURL };
}