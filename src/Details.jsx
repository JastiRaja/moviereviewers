import React, { useEffect, useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Card, ListGroup, ListGroupItem, Button } from 'react-bootstrap';
import { MdOutlineStarOutline } from "react-icons/md";
import { FaRegPlayCircle } from "react-icons/fa";
import { AuthContext } from './AuthContext';
import AddReview from './AddReview';

const Details = () => {
  const location = useLocation();
  const { apiKey, movieId } = location.state || {};
  const [movie, setMovie] = useState(null);
  const [apiReviews, setApiReviews] = useState([]);
  const [userReviews, setUserReviews] = useState([]);
  const [credits, setCredits] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const { user } = useContext(AuthContext);

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

          // Fetch user reviews for the movie from JSON Server
          fetchUserReviews();

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

  const fetchUserReviews = async () => {
    try {
      const userReviewsResponse = await axios.get(
        `http://localhost:5000/reviews?movieId=${movieId}`
      );
      setUserReviews(userReviewsResponse.data);
    } catch (error) {
      console.error('Error fetching user reviews', error);
    }
  };

  const handleDelete = async (reviewId) => {
    try {
      await axios.delete(`http://localhost:5000/reviews/${reviewId}`);
      fetchUserReviews();
    } catch (error) {
      console.error('Error deleting review', error);
    }
  };

  const getDirector = () => {
    if (credits) {
      const director = credits.crew.find(member => member.job === 'Director');
      return director ? director.name : 'N/A';
    }
    return 'N/A';
  };

  return (
    <div>
      {movie ? (
        <Card className="details-card">
          <Card.Img
            className="details-image"
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt="img"
          />
          <Card.Body>
            <Card.Title style={{background:'transparent'}}>
              <h5 className='detailsTitle'>{movie.original_title} ({movie.release_date.slice(0, 4)})</h5>
              <ListGroupItem className='date'>({movie.release_date})</ListGroupItem>
              <ListGroupItem className='language'>Language: {movie.original_language}</ListGroupItem>
              <ListGroupItem className='director'>Director: {getDirector()}</ListGroupItem>
              {trailer && (
                <div className='trailer'>
                  <Button 
                    variant="primary" 
                    onClick={() => window.open(trailer, '_blank')}
                  >
                    <FaRegPlayCircle style={{ marginRight: '5px',background:'transparent', margin:'2px'}} />Play Trailer
                  </Button>
                </div>
              )}
              <Card.Subtitle className="detailssubtitle">    
                {movie.vote_average?.toFixed(1)}
                <MdOutlineStarOutline style={{background:'transparent'}}/>
              </Card.Subtitle>
            </Card.Title>
            <Card.Text className="detailsoverview">
              <strong>Overview</strong> 
              <br />
              {movie.overview}
            </Card.Text>
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
              {apiReviews.length > 0 && (
                <ListGroup >
                  {apiReviews.map(review => (
                    <ListGroupItem key={review.id} style={{background:'transparent'}}>
                      <strong>{review.author}</strong>
                      <p>{review.content}</p>
                      <hr />
                    </ListGroupItem>
                  ))}
                </ListGroup>
              )}
                {/* Add Review Form */}
            
              {userReviews.length > 0 && (
                <ListGroup>
                  {userReviews.map(review => (
                    <ListGroupItem key={review.id}>
                      <strong>{review.author}</strong>
                      <p>{review.content}</p>
                      {user && user.id === review.userId && (
                        <div>
                          <Button variant="danger" onClick={() => handleDelete(review.id)}>
                            Delete
                          </Button>
                        </div>
                      )}
                      <hr />
                    </ListGroupItem>
                  ))}
                </ListGroup>
              )}
              {apiReviews.length === 0 && userReviews.length === 0 && (
                <p>No reviews available for this movie.</p>
              )}
               {user && (
              <AddReview movieId={movieId} fetchReviews={fetchUserReviews} />
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
