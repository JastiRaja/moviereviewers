import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Card, ListGroup, ListGroupItem } from 'react-bootstrap';
import { MdOutlineStarOutline } from "react-icons/md";
import { FaRegPlayCircle } from "react-icons/fa";

const Details = () => {
  const location = useLocation();
  const { apiKey, movieId } = location.state || {};
  const [movie, setMovie] = useState(null);
  const [apiReviews, setApiReviews] = useState([]);
  const [credits, setCredits] = useState(null);
  const [trailer, setTrailer] = useState(null);

  useEffect(() => {
    const fetchMovie = async () => {
      if (apiKey && movieId) {
        try {
          // Fetch movie details
          const response = await axios.get(
            `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`
          );
          const movieData = response.data;
          setMovie(movieData);

          // Fetch reviews for the movie from API
          const reviewsResponse = await axios.get(
            `https://api.themoviedb.org/3/movie/${movieData.id}/reviews?api_key=${apiKey}`
          );
          setApiReviews(reviewsResponse.data.results);

          // Fetch credits for the movie
          const creditsResponse = await axios.get(
            `https://api.themoviedb.org/3/movie/${movieData.id}/credits?api_key=${apiKey}`
          );
          setCredits(creditsResponse.data);

          // Fetch trailers for the movie
          const videosResponse = await axios.get(
            `https://api.themoviedb.org/3/movie/${movieData.id}/videos?api_key=${apiKey}`
          );
          const trailers = videosResponse.data.results.filter(video => video.type === 'Trailer' && video.site === 'YouTube');
          if (trailers.length > 0) {
            setTrailer(`https://www.youtube.com/watch?v=${trailers[0].key}`);
          }
        } catch (error) {
          console.error('Error fetching the movie', error);
        }
      }
    };

    fetchMovie();
  }, [apiKey, movieId]);

  return (
    <div className='details-container'>
      {movie ? (
        <Card className='movie-details'>
          <Card.Body>
            <div className='movie-header'>
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className='movie-poster'
              />
              <div className='movie-info'>
                <h1>{movie.title}</h1>
                <p className='movie-overview'>{movie.overview}</p>
                <div className='movie-meta'>
                  <p><strong>Release Date:</strong> {movie.release_date}</p>
                  <p><strong>Rating:</strong> {movie.vote_average}/10</p>
                  <p><strong>Runtime:</strong> {movie.runtime} minutes</p>
                </div>
                {trailer && (
                  <a href={trailer} target="_blank" rel="noopener noreferrer" className='trailer-button'>
                    <FaRegPlayCircle /> Watch Trailer
                  </a>
                )}
              </div>
            </div>

            <ListGroup className="list-group-flush">
              <div className='castlist'>
                {credits && credits.cast.slice(0, 5).map((actor) => (
                  <div key={actor.cast_id} className='cast-card'>
                    <img
                      src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                      alt={actor.name}
                    />
                    <p>{actor.name} as {actor.character}</p>
                  </div>
                ))}
              </div>
            </ListGroup>
          
            {/* Display Reviews */}
            <div className='reviews-section'>
              <h1>Reviews:</h1>
              {apiReviews.length > 0 ? (
                <ListGroup>
                  {apiReviews.map(review => (
                    <ListGroupItem key={review.id} style={{background:'transparent'}}>
                      <strong>{review.author}</strong>
                      <p>{review.content}</p>
                      <hr />
                    </ListGroupItem>
                  ))}
                </ListGroup>
              ) : (
                <p>No reviews available for this movie.</p>
              )}
            </div>
          </Card.Body>
        </Card>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default Details;
