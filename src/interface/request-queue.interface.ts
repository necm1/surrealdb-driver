import {Record} from './record.interface';

/**
 * @interface RequestQueue
 */
export interface RequestQueue {
  [key: number]: {
    record: Record;
    resolve: Function;
  };
}
