import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Badge, Button, Card, Spinner } from 'react-bootstrap';
import { Link, useOutletContext, useSearchParams } from 'react-router-dom';
import { MdOutlineStarOutline } from "react-icons/md";
import GenreFilter from './GenreFilter';

const MOVIES_PER_PAGE = 8;

const Home = () => {
  const outletContext = useOutletContext();
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [hoveredMovieIndex, setHoveredMovieIndex] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const apiKey = 'dd21959285ddf157a57f694a5f6fdcde';

  // Get initial searchQuery and page from URL or default
  const initialQuery = searchParams.get('query') || '';
  const initialPage = parseInt(searchParams.get('page') || '1', 10);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [currentPage, setCurrentPage] = useState(initialPage);

  // Update searchQuery in URL and state when user types
  useEffect(() => {
    if (outletContext && outletContext.searchQuery !== searchQuery) {
      setSearchQuery(outletContext.searchQuery);
    }
    // eslint-disable-next-line
  }, [outletContext && outletContext.searchQuery]);

  // Update URL when searchQuery or currentPage changes
  useEffect(() => {
    setSearchParams({ query: searchQuery, page: currentPage });
    // eslint-disable-next-line
  }, [searchQuery, currentPage]);

  // Sync currentPage and searchQuery with URL on navigation
  useEffect(() => {
    const urlPage = parseInt(searchParams.get('page') || '1', 10);
    const urlQuery = searchParams.get('query') || '';
    if (urlPage !== currentPage) {
      setCurrentPage(urlPage);
    }
    if (urlQuery !== searchQuery) {
      setSearchQuery(urlQuery);
    }
    // eslint-disable-next-line
  }, [searchParams]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get('/api/movies', {
          params: {
            path: '/genre/movie/list'
          }
        });
        setGenres(response.data.genres);
      } catch (error) {
        console.error('Error fetching genres', error);
      }
    };
    fetchGenres();
  }, []);

  useEffect(() => {
    fetchMovies(currentPage, selectedGenres);
    // eslint-disable-next-line
  }, [currentPage, selectedGenres, searchQuery]);

  const fetchAllSearchResults = async (query) => {
    setLoading(true);
    let allResults = [];
    let page = 1;
    let totalPages = 1;
    try {
      do {
        const response = await axios.get(
          `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&page=${page}`
        );
        allResults = allResults.concat(response.data.results);
        totalPages = response.data.total_pages;
        page++;
      } while (page <= totalPages && page <= 25); // TMDB allows up to 500, but limit to 25 for performance
    } catch (error) {
      console.error('Error fetching all search results', error);
    }
    setLoading(false);
    return allResults;
  };

  const fetchMovies = async (page, genres) => {
    if (searchQuery.trim() !== '') {
      // Fetch all search results and paginate locally
      const allResults = await fetchAllSearchResults(searchQuery);
      setMovies(allResults);
      setTotalPages(Math.ceil(allResults.length / MOVIES_PER_PAGE) || 1);
    } else {
      try {
        const genreIds = genres.join(',');
        const response = await axios.get('/api/movies', {
          params: {
            path: '/discover/movie',
            query: {
              page: page,
              with_genres: genreIds
            }
          }
        });
        setMovies(response.data.results);
        setTotalPages(response.data.total_pages);
      } catch (error) {
        console.error('Error fetching the movies', error);
      }
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

  // Determine if search is active
  const isSearching = searchQuery.trim() !== '';

  // Local pagination for search
  let paginatedMovies = movies;
  let pageCount = totalPages;
  if (isSearching) {
    pageCount = Math.ceil(movies.length / MOVIES_PER_PAGE) || 1;
    paginatedMovies = movies.slice((currentPage - 1) * MOVIES_PER_PAGE, currentPage * MOVIES_PER_PAGE);
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < pageCount) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    let pages = [];
    if (pageCount <= 1) return null;
    if (currentPage > 1) {
      pages.push(
        <div key="prev" className='page' onClick={handlePrevPage}>previous</div>
      );
    }
    for (let i = 1; i <= 5 && i <= pageCount; i++) {
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
    if (pageCount > 5) {
      pages.push(<span key="dots1" className='page dots'>...</span>);
      if (currentPage > 5 && currentPage <= pageCount - 2) {
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
      for (let i = pageCount - 1; i <= pageCount; i++) {
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
    if (currentPage < pageCount) {
      pages.push(
        <div key="next" className='page' onClick={handleNextPage}>next</div>
      );
    }
    return pages;
  };

  return (
    <>
      <div className='genre-filter-bar'>
        <GenreFilter
          genres={genres}
          selectedGenres={selectedGenres}
          onGenreChange={handleGenreChange}
        />
      </div>
      <section>
        {loading ? (
          <div style={{ width: '100%', textAlign: 'center', margin: '40px 0' }}>
            <Spinner animation="border" variant="danger" />
            <div style={{ color: '#F94D53', marginTop: 12 }}>Loading all results...</div>
          </div>
        ) : paginatedMovies.length === 0 ? (
          <div style={{ color: '#F94D53', textAlign: 'center', width: '100%', margin: '40px 0' }}>
            No movies found.
          </div>
        ) : (
          paginatedMovies.map((movie, index) => (
            <Card
              key={index}
              className='card1'
              onMouseEnter={() => setHoveredMovieIndex(index)}
              onMouseLeave={() => setHoveredMovieIndex(null)}
            >
              <div>
                <Card.Img
                  id='homeimage'
                  className={`images ${hoveredMovieIndex === index ? 'hovered' : ''}`}
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.original_title}
                />
                <div className='movie-title'>
                  {movie.original_title}
                </div>
                {hoveredMovieIndex === index && (
                  <Card.Body className='details'>
                    <Card.Title style={{background:'transparent'}}>
                      <Card.Subtitle className='subtitle'>
                        <Badge >{movie.vote_average?.toFixed(1)}<MdOutlineStarOutline style={{background:'transparent'}} /></Badge>
                      </Card.Subtitle>
                    </Card.Title>
                    <Card.Text className='overview'>
                      {movie.overview?.slice(0, 50)}...
                    </Card.Text>
                    <Link state={{ apiKey, movieId: movie.id }} to={{
                      pathname: '/Details',
                    }}>
                      <Button className='readmore'>Read More</Button>
                    </Link>
                  </Card.Body>
                )}
              </div>
            </Card>
          ))
        )}
        <div className='pagination'>
          {renderPagination()}
        </div>
      </section>
    </>
  );
};

export default Home;
