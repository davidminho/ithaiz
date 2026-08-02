import * as migration_20260802_085503_init from './20260802_085503_init';

export const migrations = [
  {
    up: migration_20260802_085503_init.up,
    down: migration_20260802_085503_init.down,
    name: '20260802_085503_init'
  },
];
