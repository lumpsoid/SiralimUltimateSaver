import './App.css';

import 'react-toastify/dist/ReactToastify.css';
import React, { useState } from 'react';
import { ToastContainer } from 'react-toastify';

import ResourcesCard from './AddResources';
import FileUploader from './FileUploader';

import { SaveFile } from './SaveFile';
import SummonCard from './AddSummon';
import Column from './Row';
import CreatureCard from './AddCreature';
import KnowledgeCard from './AddKnowledge';
import MaterialsCard from './AddMaterials';
import DustCard from './AddDust';
import MenuAppBar from './MainBar';

const App = () =>
{
  const [saveFile, setSaveFile] = useState<SaveFile | null>(null);

  const handleSaveFile = (data: SaveFile | null) =>
  {
    setSaveFile(data);
  };

  const cards: React.ReactElement[] = [
    <FileUploader saveFile={saveFile} setSaveFile={handleSaveFile} />,
    <ResourcesCard saveFile={saveFile} onDataCallback={handleSaveFile} />,
    <MaterialsCard saveFile={saveFile} onDataCallback={handleSaveFile} />,
    <DustCard saveFile={saveFile} onDataCallback={handleSaveFile} />,
    <SummonCard saveFile={saveFile} onDataCallback={handleSaveFile} />,
    <KnowledgeCard saveFile={saveFile} onDataCallback={handleSaveFile} />,
    <CreatureCard saveFile={saveFile} onDataCallback={handleSaveFile} />
  ];

  return (
    <div>
      <ToastContainer />
      <MenuAppBar />
      <main style={{ paddingBottom: "50vh" }}>
        <Column cards={cards} />
      </main>
    </div>
  );
};

export default App;
