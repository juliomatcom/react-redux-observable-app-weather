export const FETCH_ERROR = 'FETCH__ERROR';

export const errorAction = (error) => ({
  type: FETCH_ERROR,
  payload: error
});
