import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Badge, Button, Card } from 'react-bootstrap';
import { Link, useOutletContext, useNavigate } from 'react-router-dom';
import { MdOutlineStarOutline } from "react-icons/md";
import { AuthContext } from './AuthContext';
import GenreFilter from './GenreFilter';

const Home = () => {
  const { searchQuery } = useOutletContext();
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [hoveredMovieIndex, setHoveredMovieIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const apiKey = 'dd21959285ddf157a57f694a5f6fdcde';
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/Login');
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`
        );
        setGenres(response.data.genres);
      } catch (error) {
        console.error('Error fetching genres', error);
      }
    };

    fetchGenres();
  }, [apiKey]);

  useEffect(() => {
    fetchMovies(currentPage, selectedGenres);
  }, [currentPage, selectedGenres]);

  const fetchMovies = async (page, genres) => {
    try {
      const genreIds = genres.join(',');
      const response = await axios.get(
        `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&page=${page}&with_genres=${genreIds}`
      );
      setMovies(response.data.results);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      console.error('Error fetching the movies', error);
    }
  };

  const handleGenreChange = (genreId) => {
    setSelectedGenres(prev =>
      prev.includes(genreId)
        ? prev.filter(id => id !== genreId)
        : [...prev, genreId]
    );
    console.log('Selected Genres:', selectedGenres); // Debugging line
  };

  const filteredMovies = movies.filter(movie =>
    movie.original_title && movie.original_title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    let pages = [];

    if (currentPage > 1) {
      pages.push(
        <div key="prev" className='page' onClick={handlePrevPage}>previous</div>
      );
    }

    for (let i = 1; i <= 5 && i <= totalPages; i++) {
      pages.push(
        <div
          key={i}
          className={`page ${i === currentPage ? 'current' : ''}`}
          onClick={() => handlePageClick(i)}
        >
          {i}
        </div>
      );
    }

    if (totalPages > 5) {
      pages.push(<span key="dots1" className='page dots'>...</span>);

      if (currentPage > 5 && currentPage <= totalPages - 2) {
        pages.push(
          <div
            key={currentPage}
            className='page current'
            onClick={() => handlePageClick(currentPage)}
          >
            {currentPage}
          </div>
        );
        pages.push(<span key="dots2" className='page dots'>...</span>);
      }

      for (let i = totalPages - 1; i <= totalPages; i++) {
        pages.push(
          <div
            key={i}
            className={`page ${i === currentPage ? 'current' : ''}`}
            onClick={() => handlePageClick(i)}
          >
            {i}
          </div>
        );
      }
    }

    if (currentPage < totalPages) {
      pages.push(
        <div key="next" className='page' onClick={handleNextPage}>next</div>
      );
    }

    return pages;
  };

  return (
    <section>
      
      <GenreFilter
        genres={genres}
        selectedGenres={selectedGenres}
        onGenreChange={handleGenreChange}
      />
      {filteredMovies.map((movie, index) => (
        <Card
          key={index}
          className='card1'
          onMouseEnter={() => setHoveredMovieIndex(index)}
          onMouseLeave={() => setHoveredMovieIndex(null)}
        >
          <div>
            <Card.Img
              className={`images ${hoveredMovieIndex === index ? 'hovered' : ''}`}
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt="img"
            />
            {hoveredMovieIndex === index && (
              <Card.Body className='details'>
                <Card.Title style={{background:'transparent'}}>
                  <Card.Subtitle className='subtitle'>
                    <Badge style={{ color: 'blue', margin: "5px",background:'transparent'}}>{movie.vote_average.toFixed(1)}<MdOutlineStarOutline style={{background:'transparent'}} /></Badge>
                  </Card.Subtitle>
                  <h4>{movie.original_title.slice(0, 17)}</h4>
                </Card.Title>
                <Card.Text className='overview'>
                  {movie.overview.slice(0, 50)}...
                </Card.Text>
                <Link state={{ apiKey, movieId: movie.id }} to={{
                  pathname: '/Details',
                }}>
                  <Button className='readmore'>View Reviews...</Button>
                </Link>
              </Card.Body>
            )}
          </div>
        </Card>
      ))}
      <div className='pagination'>
        {renderPagination()}
      </div>
    </section>
  );
};

export default Home;
