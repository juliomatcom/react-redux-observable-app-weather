export const UPDATE_CITY = 'UPDATE_CITY';
export const FETCH_CITY = 'FETCH_CITY';
export const FETCH_STOP = 'FETCH_STOP';

export const updateCityAction = (data) => ({
  type: UPDATE_CITY,
  payload: data
});

export const fetchCityAction = data => ({
  type: FETCH_CITY,
  payload: data
});

export const getStopAction = data => ({
  type: FETCH_STOP
});
