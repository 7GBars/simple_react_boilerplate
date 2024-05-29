type ReadingType = 'readAsBinaryString' | 'readAsDataURL' | 'readAsDataURL' | 'readAsText';
export const FileReaderUtil =  (fileObject: File, type: ReadingType) => {
  const fileReader =  new FileReader();
  fileReader.onload = (e) => {
    const { result } = e.target;
    console.log(result)
  };

  fileReader.readAsDataURL(fileObject)
}