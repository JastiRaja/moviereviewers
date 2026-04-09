import React, { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import { Card, Button } from 'react-bootstrap';

const tmdbBaseUrl = 'https://api.themoviedb.org/3';
const tmdbImageBase = 'https://image.tmdb.org/t/p/w780';
const fallbackPoster = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600"><rect width="100%" height="100%" fill="%230f172a"/><text x="50%" y="48%" dominant-baseline="middle" text-anchor="middle" fill="%23e2e8f0" font-size="28" font-family="Arial">No Poster</text><text x="50%" y="56%" dominant-baseline="middle" text-anchor="middle" fill="%2394a3b8" font-size="16" font-family="Arial">Image unavailable</text></svg>';
const tmdbHeaders = () => ({
  Authorization: `Bearer ${process.env.REACT_APP_TMDB_ACCESS_TOKEN}`,
  Accept: 'application/json',
});

const pickTrailer = (videos = []) => {
  const youtubeVideos = videos.filter((video) => video.site === 'YouTube');
  const trailerPriority = ['Trailer', 'Teaser', 'Clip'];

  for (const type of trailerPriority) {
    const official = youtubeVideos.find((video) => video.type === type && video.official);
    if (official) return official;
    const any = youtubeVideos.find((video) => video.type === type);
    if (any) return any;
  }

  return youtubeVideos[0] || null;
};

const Details = () => {
  const location = useLocation();
  const { movieId: movieIdFromParams } = useParams();
  const { movieId: movieIdFromState, mediaType: mediaTypeFromState } = location.state || {};
  const movieId = movieIdFromState || movieIdFromParams;
  const mediaType = mediaTypeFromState || 'movie';
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [trailerUrl, setTrailerUrl] = useState('');
  const [cast, setCast] = useState([]);

  useEffect(() => {
    const fetchMovie = async () => {
      if (!movieId) {
        setError('Open movie details from the Home page.');
        return;
      }

      setIsLoading(true);
      setError('');
      try {
        const detailsResponse = await axios.get(`${tmdbBaseUrl}/${mediaType}/${movieId}`, { headers: tmdbHeaders() });
        const videosResponse = await axios.get(`${tmdbBaseUrl}/${mediaType}/${movieId}/videos`, { headers: tmdbHeaders() });
        const creditsResponse = await axios.get(`${tmdbBaseUrl}/${mediaType}/${movieId}/credits`, { headers: tmdbHeaders() });
        const trailer = pickTrailer(videosResponse.data?.results || []);
        setTrailerUrl(trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : '');
        setCast((creditsResponse.data?.cast || []).slice(0, 8));
        setMovie(detailsResponse.data || null);
      } catch (fetchError) {
        console.error('Error fetching the movie from TMDb', fetchError);
        setMovie(null);
        setError('Unable to load movie details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchMovie();
  }, [movieId, mediaType]);

  if (isLoading) {
    return (
      <div className="page-shell">
        <div className="status-message">Loading movie details...</div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="page-shell">
        <div className="details-empty content-card">
          <h2>Details unavailable</h2>
          <p>{error || 'Movie details could not be loaded.'}</p>
          <Link to="/" className="back-link">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const fallbackTrailerSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
    `${movie.title || movie.name || ''} official trailer`
  )}`;
  const resolvedTrailerUrl = trailerUrl || fallbackTrailerSearchUrl;

  return (
    <div className="page-shell">
      <Card className="details-card">
        <div className="details-media">
          <Card.Img
            className="details-image"
            src={movie.poster_path ? `${tmdbImageBase}${movie.poster_path}` : fallbackPoster}
            alt={`${movie.title || movie.name} poster`}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = fallbackPoster;
            }}
          />
        </div>
        <Card.Body className="details-content">
          <h2 className="detailsTitle">
            {movie.title || movie.name} <span>({(movie.release_date || movie.first_air_date || '').slice(0, 4)})</span>
          </h2>

          <div className="details-meta">
            <div><strong>Released:</strong> {movie.release_date || movie.first_air_date || 'N/A'}</div>
            <div><strong>Language:</strong> {(movie.spoken_languages || []).map((lang) => lang.english_name).join(', ') || 'N/A'}</div>
            <div><strong>Genre:</strong> {(movie.genres || []).map((genre) => genre.name).join(', ') || 'N/A'}</div>
            <div><strong>Runtime:</strong> {movie.runtime ? `${movie.runtime} min` : 'N/A'}</div>
            <div><strong>TMDb Rating:</strong> {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</div>
          </div>

          <Card.Text className="detailsoverview">
            <strong>Plot</strong>
            <br />
            {movie.overview || 'Overview not available.'}
          </Card.Text>

          <div className="castlist">
            <strong>Cast:</strong>{' '}
            {cast.length > 0
              ? cast.map((actor) => actor.name).join(', ')
              : 'Cast details are unavailable.'}
          </div>

          <div className="details-actions">
            <Button
              className="website-button"
              variant="primary"
              onClick={() => window.open(resolvedTrailerUrl, '_blank')}
            >
              {trailerUrl ? 'Watch Trailer' : 'Search Trailer'}
            </Button>
            <div>
              <Link to="/" className="back-link">
                Back to Home
              </Link>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Details;
