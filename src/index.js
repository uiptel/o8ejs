import { Observable, fromArray, of, timer, concat, EMPTY, throwError } from './observable';
import { Subject } from './subject';
import { map, filter, distinctUntilChanged, switchMap, take } from './operators/index';


export {
  Observable, Subject,
  fromArray, of, timer, map, filter, distinctUntilChanged, switchMap, take, concat,
  EMPTY, throwError
};
