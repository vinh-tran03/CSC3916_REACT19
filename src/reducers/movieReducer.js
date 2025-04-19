import constants from '../constants/actionTypes'

let initialState = {
      movies: [],
      selectedMovie: null
}

const movieReducer = (state = initialState, action) => {
      let updated = Object.assign({}, state);

      switch(action.type) {
            case constants.FETCH_MOVIES:
                  updated['movies'] = action.movies;
                  updated['selectedMovie'] = action.movies.length > 0 ? action.movies[0] : null;
                  return updated;
            case constants.SET_MOVIE:
                  updated['selectedMovie'] = action.selectedMovie;
                  return updated;
            case constants.FETCH_MOVIE:
                  updated['selectedMovie'] = action.selectedMovie;
                  return updated;
            case 'ADD_REVIEW':
                  if (updated.selectedMovie && updated.selectedMovie._id === action.review.movieId) {
                        updated.selectedMovie = {
                        ...updated.selectedMovie,
                        reviews: [...updated.selectedMovie.reviews, action.review]
                        };
                  }
                  return updated;       
            default:
                  return state;
      }
}

export default movieReducer;