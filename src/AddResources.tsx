import React, { useState } from 'react';
import { SaveFile, changeValueByKey } from './SaveFile';
import { Notification, Alert } from './Notification';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import BasicSelect from './BasicSelect';


interface ResourcesCardProps
{
  saveFile: SaveFile | null,
  onDataCallback: (data: SaveFile | null) => void;
}

const ResourcesCard: React.FC<ResourcesCardProps> = ({ saveFile, onDataCallback }) =>
{
  const resourceOptions = [
    { label: "All", value: "All" },
    { label: "Brimstone", value: "Brimstone" },
    { label: "Essence", value: "Essence" },
    { label: "Power", value: "Power" },
    { label: "Crystal", value: "Crystal" },
    { label: "Granite", value: "Granite" },
  ]

  const [inputValue, setInputValue] = useState('');
  //Brimstone
  const [resourceType, setResourceType] = useState(resourceOptions[1].label);



  const addBrimstoneClick = () =>
  {
    if (saveFile === null)
    {
      Alert('Provide a save file.');
      return;
    }
    if (Number.isNaN(parseInt(inputValue, 10)))
    {
      Notification('New value is not a number.');
      return;
    }
    let saveFileNew;
    switch (resourceType) {
      case "All":
        let saveFileUpdated = changeValueByKey(saveFile, "Brimstone", inputValue);
        saveFileUpdated = changeValueByKey(saveFileUpdated, "Essence", inputValue);
        saveFileUpdated = changeValueByKey(saveFileUpdated, "Power", inputValue);
        saveFileUpdated = changeValueByKey(saveFileUpdated, "Crystal", inputValue);
        saveFileNew = changeValueByKey(saveFileUpdated, "Granite", inputValue);
        break;
      case "Brimstone":
        saveFileNew = changeValueByKey(saveFile, resourceType, inputValue);
        break;
      case "Essence":
        saveFileNew = changeValueByKey(saveFile, resourceType, inputValue);
        break;
      case "Power":
        saveFileNew = changeValueByKey(saveFile, resourceType, inputValue);
        break;
      case "Crystal":
        saveFileNew = changeValueByKey(saveFile, resourceType, inputValue);
        break;
      case "Granite":
        saveFileNew = changeValueByKey(saveFile, resourceType, inputValue);
        break;
      default:
        throw new Error('Invalide resourceType selected.');
    }
    onDataCallback(saveFileNew);
    setInputValue('');
    Notification(`Resource "${resourceType}" has been added.`);
  }

  const onResourceTypeChange = (newValue: string) =>
  {
    setResourceType(newValue);
  }

  return (
    <Card>
      <CardContent className="resourceAdd card">
        <h3>Add resource</h3>
        <BasicSelect
          options={resourceOptions}
          id={'resources-select'}
          inputLabel={'Resource type'}
          // Brimstone
          defaultValue={resourceOptions[1].label}
          onChangeCallback={onResourceTypeChange}
        />
        <TextField
          type="number"
          inputProps={{min: 0}}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter resource new value"
        />
        <Button variant="outlined" color="primary" onClick={addBrimstoneClick}>
          Add resource
        </Button>
      </CardContent>
    </Card>
  );
};

export default ResourcesCard;