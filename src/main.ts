import './style.css';
import { el } from './ui/dom';
import { createAppBar } from './ui/appBar';
import { createFileUploaderCard } from './ui/fileUploaderCard';
import { createResourcesCard } from './ui/resourcesCard';
import { createQuantityCard } from './ui/quantityCard';
import { createSummonCard } from './ui/summonCard';
import { createKnowledgeCard } from './ui/knowledgeCard';
import { createCreatureCard } from './ui/creatureCard';

const root = document.getElementById('root');

if (!root)
{
  throw new Error("Root element with ID 'root' not found.");
}

const cards = [
  createFileUploaderCard(),
  createResourcesCard(),
  createQuantityCard({
    title: 'Add materials',
    key: 'MaterialQuantity',
    placeholder: 'Enter materials new value',
    buttonLabel: 'Add materials',
    successMessage: 'Materials was added.',
  }),
  createQuantityCard({
    title: 'Add dust',
    key: 'DustQuantity',
    placeholder: 'Enter dust new value',
    buttonLabel: 'Add dust',
    successMessage: 'Dust was added.',
  }),
  createSummonCard(),
  createKnowledgeCard(),
  createCreatureCard(),
];

root.append(
  createAppBar(),
  el('main', { class: 'card-column' }, ...cards),
);
