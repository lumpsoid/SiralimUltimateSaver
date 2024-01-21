import React, { useState } from 'react';
import { Alert, Notification } from "./Notification";
import { SaveFile, decodeFile, encodeFile, isFileEncoded } from "./SaveFile";

import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Typography from '@mui/material/Typography';
import BasicSelect from './BasicSelect';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

interface FileUploaderProps
{
  saveFile: SaveFile | null,
  setSaveFile: (data: SaveFile | null) => void; // Adjust the type according to your callback requirements
}

const FileUploader: React.FC<FileUploaderProps> = ({ saveFile, setSaveFile }) =>
{
  const [isFileExist, setFileExist] = useState<boolean>(false);
  const [saveType, setSaveType] = useState<string>("encoded");

  const saveTypeOptions = [
    { label: "save file", value: "encoded" },
    { label: "text", value: "decoded" },
  ];

  const onSaveTypeSelect = (newValue: string) =>
  {
    setSaveType(newValue);
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) =>
  {
    if (event.target.files == null)
    {
      Alert('File is not found.');
      return;
    }
    const namePattern = /.*\.sav.*/;
    const file = event.target.files[0];
    if (file)
    {
      // if bigger than 10 Mb
      if (file.size > 10000000)
      {
        Alert('File bigger than 10Mb.');
        return;
      }
      if (!file.name.match(namePattern))
      {
        Alert('File is not a save file.');
        return;
      }
      // Read the file content
      const fileReader = new FileReader();
      fileReader.onload = function (e)
      {
        if (fileReader.result && typeof fileReader.result === 'string')
        {
          const isEncoded = isFileEncoded(fileReader.result);
          const saveFile = new SaveFile(
            file.name,
            fileReader.result,
            fileReader.result
          );
          let saveFileUpdated;
          if (isEncoded)
          {
            saveFileUpdated = decodeFile(saveFile);
          } else
          {
            saveFileUpdated = saveFile;
          }
          setSaveFile(saveFileUpdated);
          setFileExist(true);
        } else
        {
          Alert('File content is not a string.');
        }
      };
      fileReader.readAsText(file);
    }
  };

  const handleClearFile = () =>
  {
    // Clear the selected file by setting it to null
    setSaveFile(null);
    setFileExist(false);
  };

  const handleSaveFile = () =>
  { 
    if (saveFile === null)
    {
      Alert('No file selected for download.');
      return;
    }
    let blob;
    switch (saveType)
    {
      case "encoded":
        const saveFileOutput = encodeFile(saveFile);
        blob = new Blob([saveFileOutput.contentNew]);
        break;
      case "decoded":
        blob = new Blob([saveFile.contentNew]);
        break;
      default:
        throw new Error('Selected invalide save type.')
    }
    // Create a temporary link element
    const link = document.createElement('a');

    // Create an object URL from the Blob
    const url = URL.createObjectURL(blob);

    // Set the href attribute to the object URL
    link.href = url;

    // Specify the download attribute with the desired file name
    link.download = Date.now().toString() + saveFile.name;

    // Append the link to the document body
    document.body.appendChild(link);

    // Trigger a click on the link to start the download
    link.click();

    // Remove the link and revoke the object URL
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <Card>
      <CardContent className='card fileUploader'>
        {isFileExist ? (
          <div>
            <Typography variant="h6">Selected File: {saveFile?.name}</Typography>
            <Button variant="contained" color="primary" onClick={handleClearFile}>
              Clear File
            </Button>
            <Button variant="contained" color="primary" onClick={handleSaveFile}>
              Save
            </Button>
          </div>
        ) : (
          <div>
            <Button sx={{ marginBottom: "5px" }} component="label" variant="contained" startIcon={<CloudUploadIcon />}>
              Choose save file
              <VisuallyHiddenInput type="file" onChange={handleFileChange} />
            </Button>
          </div>
        )}
        <BasicSelect
          options={saveTypeOptions}
          id={'select-save-type'}
          inputLabel={'Save as'}
          defaultValue={saveType}
          onChangeCallback={onSaveTypeSelect}
        />
      </CardContent>
    </Card>
  );
};

export default FileUploader;