import { TestScheduler } from 'rxjs/testing';
import { ActionsObservable } from 'redux-observable';
import { ajax } from 'rxjs/ajax';
import { Observable, of } from 'rxjs';
import {
  fetchCityAction,
  updateCityAction
} from '../actions/cityActions';
import {
  errorAction,
  loadingAction
} from '../actions/uiActions';
import { cityEpic } from './citiesEpic';

const responseMock = {
  name: 'Havana',
  main: {
    temp: 25
  },
  weather: [
    {
      description: 'foo',
      icon: 'icon.png'
    }
  ]
};
const dataMock = {
  city: 'Havana',
  data: {
    temp: 25,
    description: 'foo',
    icon: 'icon.png'
  }
};
const errorMock = new Error('fail');
const emptyCityMock = { city: '', data: {} };

const deepEquals = (actual, expected) =>
  expect(actual).toEqual(expected);

const createTestScheduler = () =>
  new TestScheduler(deepEquals);

describe('cityEpic()', () => {
  describe('- happyPath', () => {
    beforeEach(() => {
      // mock getJSON response
      ajax.getJSON = jest.fn(() => {
        return of(responseMock)
      });
    });

    it('should update city if response is OK', () => {
      const marbles1 = '-f';
      const marbles2 = '-(ule)';

      const values = {
        f: fetchCityAction('Havana'),
        u: updateCityAction(dataMock),
        l: loadingAction(false),
        e: errorAction() // no errors really
      };

      const ts = createTestScheduler();
      const source = ActionsObservable.from(
        ts.createColdObservable(marbles1, values)
      );
      const actual = cityEpic(source);
      ts.expectObservable(actual).toBe(marbles2, values);
      ts.flush();
    });

    afterEach(() => {
      ajax.getJSON.mockRestore();
    });
  });

  describe('- error path', () => {
    beforeEach(() => {
      // mock getJSON response
      ajax.getJSON = jest.fn(() => {
        return new Observable(observer => {
          observer.error(errorMock);
        });
      });
    });

    it('if error launch actions', () => {
      const marbles1 = '-f';
      const marbles2 = '-(elu)';

      const values = {
        f: fetchCityAction('Havana'),
        u: updateCityAction(emptyCityMock),
        l: loadingAction(false),
        e: errorAction(errorMock)
      };

      const ts = createTestScheduler();
      const source = ActionsObservable.from(
        ts.createColdObservable(marbles1, values)
      );
      const actual = cityEpic(source);
      // actions
      ts.expectObservable(actual).toBe(marbles2, values);
      ts.flush();
      // retries
      // console.log(ajax.getJSON.mock.calls);
      // expect(ajax.getJSON.mock.calls.length).toEqual(3);
    });

    afterEach(() => {
      ajax.getJSON.mockRestore();
    });
  });
})
