import { SET_CONVERSATIONS, SET_MESSAGES, ADD_MESSAGE } from '../actions/types';
import update from 'react-addons-update';

const initialState = {
  conversations: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_CONVERSATIONS:
      return {
        ...state,
        conversations: action.payload,
      };
    case SET_MESSAGES:
      return {
        ...state,
        [action.conv_id]: action.payload,
      };
    case ADD_MESSAGE:
      return {
        ...state,
        [action.conv_id]: [...state[action.conv_id], action.payload],
      };
      return update(state, {
        contents: {
          [action.conv_id]: {
            $push: action.payload,
          },
        },
      });
    default:
      return state;
  }
}
