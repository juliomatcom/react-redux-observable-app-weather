export const FETCH_ERROR = 'FETCH__ERROR';

export const UI_LOADING = 'UI_LOADING';

export const errorAction = (error) => ({
  type: FETCH_ERROR,
  payload: error
});

export const loadingAction = (flag = false) => ({
  type: UI_LOADING,
  payload: flag
});
