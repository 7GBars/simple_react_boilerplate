import {useEffect} from "react";
import {useState} from "react";

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
          console.log(result)
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