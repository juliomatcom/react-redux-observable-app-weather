import { TestScheduler } from 'rxjs/testing';
import { ActionsObservable } from 'redux-observable';
import { ajax } from 'rxjs/ajax';
import { Observable, of } from 'rxjs';

import {
  fetchCityAction,
  updateCityAction,
  getStopAction
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
const errorMock = 'error';
const emptyCityMock = { city: '', data: {} };

const deepEquals = (actual, expected) =>
  expect(actual).toEqual(expected);

const createTestScheduler = () =>
  new TestScheduler(deepEquals);

describe('cityEpic()', () => {
  describe('- happyPath', () => {
    it('should update city if response is OK', () => {
      const ts = createTestScheduler();

      // Mock with marble so we can delay (time in frames) the response
      ajax.getJSON = jest.fn(() => {
        const marbleMock = '----m';
        const values = { m: responseMock };

        return ActionsObservable.from(
          ts.createColdObservable(marbleMock, values)
        );
      });

      const marbles1 = '-f';
      const marbles2 = '-----(ule)';

      const values = {
        f: fetchCityAction('Havana'),
        u: updateCityAction(dataMock),
        l: loadingAction(false),
        e: errorAction() // no errors really
      };

      const source = ActionsObservable.from(
        ts.createColdObservable(marbles1, values)
      );
      const actual = cityEpic(source);
      ts.expectObservable(actual).toBe(marbles2, values);
      ts.flush();
      ajax.getJSON.mockRestore();

    });
  });

  describe('takeUntil', () => {
    it('should stop if FETCH_STOP is dispatched', () => {
      const ts = createTestScheduler();
      // Mock with marble so we can delay (time in frames) the response
      ajax.getJSON = jest.fn(() => {
        const marbleMock = '----m';
        const values = { m: responseMock };

        return ActionsObservable.from(
          ts.createColdObservable(marbleMock, values)
        );
      });

      const marbles1 = '-f-s';
      const marbles2 = '';

      const values = {
        f: fetchCityAction('Havana'),
        s: getStopAction()
      };

      const source = ActionsObservable.from(
        ts.createColdObservable(marbles1, values)
      );
      const actual = cityEpic(source);
      ts.expectObservable(actual).toBe(marbles2, values);
      ts.flush();

      ajax.getJSON.mockRestore();

    });
  });

  describe('- error path', () => {
    it('if error launch actions', () => {
      // mock getJSON response
      ajax.getJSON = jest.fn(() => {
        return new Observable(observer => {
          observer.error(errorMock);
        });
      });

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

      ajax.getJSON.mockRestore();
    });
  });

  describe('- retries', () => {

    it('if error launch actions', () => {
      const ts = createTestScheduler();

      const spy = jest.fn(() => {
        const marbleMock = '-#';
        const values = { m: responseMock };

        return ActionsObservable.from(
          ts.createColdObservable(marbleMock, values)
        );
      });
      ajax.getJSON = spy;

      const marbles1 = '-f';
      const marbles2 = '----(elu)'; // <--- 3+ frames

      const values = {
        f: fetchCityAction('Havana'),
        u: updateCityAction(emptyCityMock),
        o: updateCityAction(dataMock),
        l: loadingAction(false),
        e: errorAction(errorMock),
        p: errorAction(),
      };

      const source = ActionsObservable.from(
        ts.createColdObservable(marbles1, values)
      );
      const actual = cityEpic(source);
      // actions
      ts.expectObservable(actual).toBe(marbles2, values);
      ts.flush();
    });

    afterEach(() => {
      ajax.getJSON.mockRestore();
    });
  });
})
