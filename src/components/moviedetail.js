import React, { useEffect, useRef } from 'react';
import { fetchMovie } from '../actions/movieActions';
import { useDispatch, useSelector } from 'react-redux';
import { Card, ListGroup, ListGroupItem, Image } from 'react-bootstrap';
import { BsStarFill } from 'react-icons/bs';
import { useParams } from 'react-router-dom';

const MovieDetail = () => {
  const dispatch = useDispatch();
  const { movieId } = useParams();
  const selectedMovie = useSelector(state => state.movie.selectedMovie);
  const loading = useSelector(state => state.movie.loading);
  const error = useSelector(state => state.movie.error);

  
  const reviewRef = useRef();
  const ratingRef = useRef();

  useEffect(() => {
    dispatch(fetchMovie(movieId));
  }, [dispatch, movieId]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    const reviewText = reviewRef.current.value;
    const ratingValue = parseFloat(ratingRef.current.value);

    const reviewData = {
      movieId,
      username: localStorage.getItem('username'),
      review: reviewText,
      rating: ratingValue
    };

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token'),
        },
        body: JSON.stringify(reviewData),
      });

      if (!res.ok) throw new Error('Failed to submit review');

      dispatch({ type: 'ADD_REVIEW', review: reviewData });

      dispatch(fetchMovie(movieId)); // Refresh movie details

      // Clear inputs manually
      reviewRef.current.value = '';
      ratingRef.current.value = '';
    } catch (error) {
      console.error(error);
    }
  };

  const DetailInfo = () => {
    if (loading) return <div>Loading....</div>;
    if (error) return <div>Error: {error}</div>;
    if (!selectedMovie) return <div>No movie data available.</div>;

    return (
      <Card className="bg-dark text-dark p-4 rounded">
        <Card.Header>Movie Detail</Card.Header>
        <Card.Body>
          <Image className="image" src={selectedMovie.imageUrl} thumbnail />
        </Card.Body>
        <ListGroup>
          <ListGroupItem>{selectedMovie.title}</ListGroupItem>
          <ListGroupItem>
            {selectedMovie.actors?.map((actor, i) => (
              <p key={i}>
                <b>{actor.actorName}</b> {actor.characterName}
              </p>
            ))}
          </ListGroupItem>
          <ListGroupItem>
            <h4><BsStarFill /> {selectedMovie.averageRating || "N/A"}</h4>
          </ListGroupItem>
        </ListGroup>
        <Card.Body className="text-light">
          {selectedMovie.reviews?.map((review, i) => (
            <p key={i}>
              <b>{review.username}</b>&nbsp; {review.review} &nbsp; <BsStarFill /> {review.rating}
            </p>
          ))}
        </Card.Body>
        <Card.Body className="text-light">
          <h5>Leave a Review</h5>
          <form onSubmit={handleSubmitReview}>
            <textarea
              ref={reviewRef}
              className="form-control mb-2"
              rows={3}
              placeholder="Write your review..."
            />
            <input
              type="number"
              min="0"
              max="5"
              step="0.1"
              ref={ratingRef}
              className="form-control mb-2"
              placeholder="Rating (0 - 5)"
            />
            <button type="submit" className="btn btn-primary">
              Submit Review
            </button>
          </form>
        </Card.Body>
      </Card>
    );
  };

  return <DetailInfo />;
};

export default MovieDetail;
