import { Observable, fromArray, timer } from './observable';
import { Subject } from './subject';
import { map, filter, distinctUntilChanged } from './operators/index';


export {
  Observable, Subject,
  fromArray, timer, map, filter, distinctUntilChanged
};
