import { Observable, fromArray, timer, EMPTY } from './observable';
import { Subject } from './subject';
import { map, filter, distinctUntilChanged, switchMap } from './operators/index';


export {
  Observable, Subject,
  fromArray, timer, map, filter, distinctUntilChanged, switchMap,
  EMPTY
};
