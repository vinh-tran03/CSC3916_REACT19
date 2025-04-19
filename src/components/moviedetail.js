import React, { useEffect, useState } from 'react';
import { fetchMovie } from '../actions/movieActions';
import { useDispatch, useSelector } from 'react-redux';
import { Card, ListGroup, ListGroupItem, Image } from 'react-bootstrap';
import { BsStarFill } from 'react-icons/bs';
import { useParams } from 'react-router-dom'; // Import useParams

const MovieDetail = () => {
  const dispatch = useDispatch();
  const { movieId } = useParams(); // Get movieId from URL parameters
  const selectedMovie = useSelector(state => state.movie.selectedMovie);
  const loading = useSelector(state => state.movie.loading); // Assuming you have a loading state in your reducer
  const error = useSelector(state => state.movie.error); // Assuming you have an error state in your reducer
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    const reviewData = {
      movieId,
      username: localStorage.getItem('username'), // or however you're storing it
      review: reviewText,
      rating: parseFloat(rating)
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
  
      // Re-fetch movie details to update reviews
      dispatch(fetchMovie(movieId));
      setReviewText('');
      setRating(0);
    } catch (error) {
      console.error(error);
    }
  };
  
  useEffect(() => {
    dispatch({
      type: 'ADD_REVIEW',
      review: { movieId, username: localStorage.getItem('username'), review: reviewText, rating: parseFloat(rating) }
    });
  }, [dispatch, movieId]);

  const DetailInfo = () => {
    if (loading) {
      return <div>Loading....</div>;
    }

    if (error) {
      return <div>Error: {error}</div>;
    }

    if (!selectedMovie) {
      return <div>No movie data available.</div>;
    }
    console.log("Movie Reviews:", selectedMovie.reviews); // Log reviews to check

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
            <h4>
              <BsStarFill /> {selectedMovie.averageRating || "N/A"}
            </h4>
          </ListGroupItem>
        </ListGroup>
        <Card.Body className="text-light">
          {selectedMovie.reviews?.map((review, i) => (
            <p key={i}>
              <b>{review.username}</b>&nbsp; {review.review} &nbsp; <BsStarFill />{' '}
              {review.rating}
            </p>
          ))}
        </Card.Body>
        <Card.Body className="text-light">
          <h5>Leave a Review</h5>
          <div className="mb-3">
          <textarea
            className="form-control mb-2"
            rows={3}
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Write your review..."
          />
          <input
            type="number"
            min="0"
            max="5"
            step="0.1"
            className="form-control mb-2"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            placeholder="Rating (0 - 5)"
          />
          <button className="btn btn-primary" onClick={(e) => handleSubmitReview(e)}>
            Submit Review
          </button>
          </div>
        </Card.Body>
      </Card>
    );
  };

  return <DetailInfo />;
};


export default MovieDetail;