import { EventEmitter } from 'events';

import { RoomConstructor } from './../Room';
import { RoomListingData } from './drivers/Driver';

export const INVALID_OPTION_KEYS: Array<keyof RoomListingData> = [
  'clients',
  'locked',
  'private',
  // 'maxClients', - maxClients can be useful as filter options
  'metadata',
  'name',
  'processId',
  'roomId',
];

export interface SortOptions { [fieldName: string]: 1 | -1 | 'asc' | 'desc' | 'ascending' | 'descending'; }

export class RegisteredHandler extends EventEmitter {
  public filterOptions: string[] = [];
  public sortOptions?: SortOptions;
  public instanceLimit: number;
  public instanceCount: number = 0;

  constructor(
    public klass: RoomConstructor,
    public options: any
  ) {
    super();
  }

  public filterBy(options: string[]) {
    this.filterOptions = options;
    return this;
  }

  public maxInstances(value: number) {
    this.instanceLimit = value;
    return this;
  }

  public sortBy(options: SortOptions) {
    this.sortOptions = options;
    return this;
  }

  public getFilterOptions(options: any) {
    return this.filterOptions.reduce((prev, curr, i, arr) => {
      const field = arr[i];
      if (options[field]) {
        if (INVALID_OPTION_KEYS.indexOf(field as any) !== -1) {
          console.warn(`option "${field}" has internal usage and is going to be ignored.`);

        } else {
          prev[field] = options[field];
        }
      }
      return prev;
    }, {});
  }

  public isAvailableInstantiation() {
    return this.instanceLimit == null || this.instanceCount < this.instanceLimit;
  }
}
