import { dashboardRegistry } from './registries/dashboardRegistry';
import { studentRegistry } from './registries/studentRegistry';
import { financeRegistry } from './registries/financeRegistry';
import { hrRegistry } from './registries/hrRegistry';
import { assessmentRegistry } from './registries/assessmentRegistry';
import { adminRegistry } from './registries/adminRegistry';
import { moreRegistry } from './registries/moreRegistry';
import { myDetailsRegistry } from './registries/myDetailsRegistry';
import { pluginsRegistry } from './registries/pluginsRegistry';

export const pageRegistry: Record<string, () => any> = {
  ...dashboardRegistry,
  ...studentRegistry,
  ...financeRegistry,
  ...hrRegistry,
  ...assessmentRegistry,
  ...adminRegistry,
  ...moreRegistry,
  ...myDetailsRegistry,
  ...pluginsRegistry
};
