import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMovies, setMovie } from "../actions/movieActions";
import { Link } from 'react-router-dom';
import { Image, Nav, Carousel } from 'react-bootstrap';
import { BsStarFill } from 'react-icons/bs';

function MovieList() {
    const dispatch = useDispatch();
    const movies = useSelector(state => state.movie.movies);
    console.log("Movies in Redux state:", movies);

    useEffect(() => {
        dispatch(fetchMovies());
    }, [dispatch]);

    const handleSelect = (selectedIndex) => {
        if (Array.isArray(movies) && movies[selectedIndex]) {
            dispatch(setMovie(movies[selectedIndex]));
        }
    };

    const handleClick = (movie) => {
        dispatch(setMovie(movie));
    };

    if (!Array.isArray(movies)) {
        return <div>Loading....</div>;
    }

    return (
        <Carousel onSelect={handleSelect} className="bg-dark text-light p-4 rounded">
            {movies.map((movie) => (
                <Carousel.Item key={movie._id}>
                    <Nav.Link
                        as={Link}
                        to={`/movie/${movie._id}`}
                        onClick={() => handleClick(movie)}
                    >
                        <Image className="image" src={movie.imageUrl} alt={movie.title} thumbnail />
                    </Nav.Link>
                    <Carousel.Caption>
                        <h3>{movie.title}</h3>
                        <BsStarFill /> {movie.averageRating || "N/A"} &nbsp;&nbsp; {movie.releaseDate}
                    </Carousel.Caption>
                </Carousel.Item>
            ))}
        </Carousel>
    );
}

export default MovieList;
