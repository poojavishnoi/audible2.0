export const actionType = {
  SET_USER : "SET_USER",
  SET_ALL_AUDIO : "SET_ALL_AUDIO"
}

const reducer = (state, action) => {
  switch (action.type){
    case actionType.SET_USER: 
      return {
        ...state,
        user: action.user
      }

      case actionType.SET_ALL_AUDIO: 
      return {
        ...state,
        allAudio: action.allAudio
      }

      default:
        return state
  }
}

export default reducer