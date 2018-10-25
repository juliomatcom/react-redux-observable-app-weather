import { filter,
  flatMap,
  switchMap,
  catchError,
  retry,
  takeUntil
} from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';
import { of } from 'rxjs';
import {
  FETCH_CITY,
  FETCH_STOP,
  updateCityAction
} from '../actions/cityActions';
import {
  errorAction
} from '../actions/uiActions';
import api from '../api.json'

const API_ID = api.id;
const API_HOST = `http://api.openweathermap.org/data/2.5/weather?q=:city&appid=${API_ID}&units=metric`;

export const cityEpic = function (action$) { // switchMap, takeUntil
  return action$.pipe(
    filter(action => action.type === FETCH_CITY),
    switchMap(action => {
      const response$ = ajax.getJSON(API_HOST.replace(':city', action.payload));
      return response$.pipe(
        flatMap(response => {
          const data = {
            city: response.name,
            data: {
              temp: response.main.temp,
              ...response.weather[0]
            }
          };
          return of(
            updateCityAction(data),
            errorAction()
          );
        }),
        takeUntil(action$.pipe( // Cancellation:  https://github.com/redux-observable/redux-observable/blob/master/docs/recipes/Cancellation.md
          filter(action => action.type === FETCH_STOP)
        )),
        retry(2), // retry on error
        catchError(error => { // end of stream response$
          return of(
            errorAction(error),
            updateCityAction({
              city: '',
              data: {}
            })
          );
        })
      );
    })
  );
}
