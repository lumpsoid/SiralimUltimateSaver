import './style.css';
import { el, cardGroup } from './ui/dom';
import { saveFileStore } from './state/store';
import { createAppBar } from './ui/appBar';
import { createFilePanel } from './ui/fileUploaderCard';
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

// Mutation actions, grouped by theme. Built once; the grid is revealed only
// after a save file is loaded (see the `has-file` gate below).
const actionGrid = el('div', { class: 'action-grid' },
  cardGroup('Resources', 'resources',
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
  ),
  cardGroup('Creatures', 'creatures',
    createSummonCard(),
    createKnowledgeCard(),
    createCreatureCard(),
  ),
);

const workspace = el('main', { class: 'workspace' },
  createFilePanel(),
  actionGrid,
);

// Gate: the action grid is hidden until a file is present.
const applyGate = (file: unknown) =>
  workspace.classList.toggle('has-file', file !== null);

saveFileStore.subscribe(applyGate);
applyGate(saveFileStore.get());

root.append(createAppBar(), workspace);
