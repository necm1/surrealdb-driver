import { Record } from './record.interface';
export interface RequestQueue {
    [key: number]: {
        record: Record;
        resolve: Function;
    };
}
