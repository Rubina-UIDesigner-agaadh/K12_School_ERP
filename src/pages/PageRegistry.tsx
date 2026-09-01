import React from 'react';
import { dashboardRegistry } from './registries/dashboardRegistry';
import { studentRegistry } from './registries/studentRegistry';
import { financeRegistry } from './registries/financeRegistry';
import { assessmentRegistry } from './registries/assessmentRegistry';
import { hrRegistry } from './registries/hrRegistry';
import { adminRegistry } from './registries/adminRegistry';
import { moreRegistry } from './registries/moreRegistry';
import { myDetailsRegistry } from './registries/myDetailsRegistry';
import { pluginsRegistry } from './registries/pluginsRegistry';
export const pageRegistry: Record<string, () => any> = {
  ...dashboardRegistry,
  ...studentRegistry,
  ...financeRegistry,
  ...assessmentRegistry,
  ...hrRegistry,
  ...adminRegistry,
  ...moreRegistry,
  ...myDetailsRegistry,
  ...pluginsRegistry
};