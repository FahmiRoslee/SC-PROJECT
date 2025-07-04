const initialState = {
    newsToEdit: null,
    allNews: [],
  };
  
  const newsReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SET_NEWS':
        return { ...state, newsToEdit: action.payload };
      default:
        return state;
    }
  };
  
  export default newsReducer;
  