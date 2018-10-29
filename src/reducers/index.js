import { UPDATE_CITY } from '../actions/cityActions';
import {
  FETCH_ERROR,
  UI_LOADING
} from '../actions/uiActions';

export default function(state, action) {
  switch (action.type) {
    case UPDATE_CITY:
      return {
        ...state,
        city: action.payload.city,
        data: action.payload.data
      }
    case FETCH_ERROR:
      return {
        ...state,
        error: action.payload,
      }
    case UI_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    default:
      return state;
  }
};
