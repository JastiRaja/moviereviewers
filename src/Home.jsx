import React, { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Button, Card } from 'react-bootstrap';
import { Link, useOutletContext, useSearchParams } from 'react-router-dom';

const tmdbBaseUrl = 'https://api.themoviedb.org/3';
const fallbackPoster = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="450"><rect width="100%" height="100%" fill="%230f172a"/><text x="50%" y="48%" dominant-baseline="middle" text-anchor="middle" fill="%23e2e8f0" font-size="22" font-family="Arial">No Poster</text><text x="50%" y="56%" dominant-baseline="middle" text-anchor="middle" fill="%2394a3b8" font-size="14" font-family="Arial">Image unavailable</text></svg>';
const RESULTS_PER_PAGE = 10;
const CURRENT_YEAR = new Date().getFullYear();
const MIN_YEAR = 1960;
const tmdbImageBase = 'https://image.tmdb.org/t/p/w500';
const today = new Date().toISOString().split('T')[0];
const indianLanguageCodes = new Set(['hi', 'ta', 'te', 'ml', 'kn', 'bn', 'mr', 'pa']);

const getReleaseYear = (yearValue) => {
  const match = String(yearValue || '').match(/\d{4}/);
  return match ? parseInt(match[0], 10) : 0;
};

const tmdbHeaders = () => ({
  Authorization: `Bearer ${process.env.REACT_APP_TMDB_ACCESS_TOKEN}`,
  Accept: 'application/json',
});

const Home = () => {
  const { searchQuery } = useOutletContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const pageFromUrl = parseInt(searchParams.get('page') || '1', 10);
  const initialPage = Number.isNaN(pageFromUrl) || pageFromUrl < 1 ? 1 : pageFromUrl;
  const initialType = searchParams.get('type') === 'tv' ? 'tv' : 'movie';
  const initialYear = /^\d{4}$/.test(searchParams.get('year') || '') ? searchParams.get('year') : 'all';
  const initialGenre = searchParams.get('genre') || 'all';
  const initialLanguage = searchParams.get('lang') || 'all';
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [apiMessage, setApiMessage] = useState('');
  const [selectedType, setSelectedType] = useState(initialType);
  const [selectedYear, setSelectedYear] = useState(initialYear);
  const [selectedGenre, setSelectedGenre] = useState(initialGenre);
  const [selectedLanguage, setSelectedLanguage] = useState(initialLanguage);
  const [genreOptions, setGenreOptions] = useState([]);
  const effectiveQuery = searchQuery.trim();
  const previousQueryRef = useRef(effectiveQuery);
  const previousTypeRef = useRef(selectedType);
  const previousYearRef = useRef(selectedYear);
  const previousLanguageRef = useRef(selectedLanguage);
  const typeFilters = [
    { key: 'movie', label: 'Movies' },
    { key: 'tv', label: 'Series' },
  ];
  const languageOptions = [
    { code: 'all', label: 'All Languages' },
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'Hindi' },
    { code: 'ta', label: 'Tamil' },
    { code: 'te', label: 'Telugu' },
    { code: 'ml', label: 'Malayalam' },
    { code: 'kn', label: 'Kannada' },
    { code: 'bn', label: 'Bengali' },
    { code: 'mr', label: 'Marathi' },
    { code: 'pa', label: 'Punjabi' },
  ];

  const availableYears = [];
  for (let year = CURRENT_YEAR; year >= MIN_YEAR; year -= 1) {
    availableYears.push(year);
  }

  const totalPages = Math.ceil(totalResults / RESULTS_PER_PAGE);
  const filteredMovies = movies;
  const selectedGenreLabel =
    selectedGenre === 'all' ? null : genreOptions.find((genre) => String(genre.id) === String(selectedGenre))?.name || null;
  const selectedLanguageLabel =
    selectedLanguage === 'all' ? null : languageOptions.find((lang) => lang.code === selectedLanguage)?.label || null;
  const activeFilters = [
    selectedType !== 'movie' ? `Type: ${selectedType === 'tv' ? 'Series' : selectedType}` : null,
    selectedYear !== 'all' ? `Year: ${selectedYear}` : null,
    selectedGenreLabel ? `Genre: ${selectedGenreLabel}` : null,
    selectedLanguageLabel ? `Language: ${selectedLanguageLabel}` : null,
  ].filter(Boolean);

  const setPage = useCallback((page) => {
    const safePage = page < 1 ? 1 : page;
    setCurrentPage(safePage);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (safePage === 1) {
        next.delete('page');
      } else {
        next.set('page', String(safePage));
      }
      return next;
    });
  }, [setSearchParams]);

  const updateFilterParams = useCallback((type, year, genre, lang) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);

      const updateParam = (key, value, defaultValue = 'all') => {
        if (value === defaultValue) {
          next.delete(key);
        } else {
          next.set(key, String(value));
        }
      };

      updateParam('type', type, 'movie');
      updateParam('year', year, 'all');
      updateParam('genre', genre, 'all');
      updateParam('lang', lang, 'all');

      return next;
    });
  }, [setSearchParams]);

  useEffect(() => {
    const hasQueryChanged = previousQueryRef.current !== effectiveQuery;
    const hasTypeChanged = previousTypeRef.current !== selectedType;
    const hasYearChanged = previousYearRef.current !== selectedYear;
    const hasLanguageChanged = previousLanguageRef.current !== selectedLanguage;

    if (hasQueryChanged || hasTypeChanged || hasYearChanged || hasLanguageChanged) {
      setPage(1);
      setSelectedGenre('all');
    }

    previousQueryRef.current = effectiveQuery;
    previousTypeRef.current = selectedType;
    previousYearRef.current = selectedYear;
    previousLanguageRef.current = selectedLanguage;
  }, [effectiveQuery, selectedType, selectedYear, selectedLanguage, setPage]);

  useEffect(() => {
    fetchGenres(selectedType);
  }, [selectedType]);

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setPage(totalPages);
    }
  }, [totalPages, currentPage, setPage]);

  const fetchGenres = async (type) => {
    try {
      const endpoint = type === 'tv' ? 'tv' : 'movie';
      const response = await axios.get(`${tmdbBaseUrl}/genre/${endpoint}/list`, { headers: tmdbHeaders() });
      setGenreOptions(response.data?.genres || []);
    } catch (error) {
      setGenreOptions([]);
    }
  };

  const fetchMovies = useCallback(async (query, type, year, page) => {
    setIsLoading(true);
    setApiMessage('');
    try {
      const endpoint = query ? `/search/${type}` : `/discover/${type}`;
      const params = query
        ? {
            query,
            page,
            include_adult: false,
            language: 'en-US',
            ...(year !== 'all' ? { primary_release_year: year, first_air_date_year: year } : {}),
            ...(selectedLanguage !== 'all' ? { with_original_language: selectedLanguage } : {}),
          }
        : {
            page,
            sort_by: type === 'tv' ? 'first_air_date.desc' : 'primary_release_date.desc',
            include_adult: false,
            language: 'en-US',
            ...(year !== 'all' ? { primary_release_year: year, first_air_date_year: year } : {}),
            ...(selectedLanguage !== 'all' ? { with_original_language: selectedLanguage } : {}),
            ...(selectedGenre !== 'all' ? { with_genres: selectedGenre } : {}),
          };

      if (!query && selectedYear === 'all') {
        if (type === 'tv') {
          params['first_air_date.lte'] = today;
        } else {
          params['primary_release_date.lte'] = today;
        }
      }

      // Better regional matching for Indian language browsing.
      if (selectedLanguage !== 'all' && indianLanguageCodes.has(selectedLanguage)) {
        params.with_origin_country = 'IN';
        params.region = 'IN';
      }

      if (query && selectedGenre !== 'all') {
        params.with_genres = selectedGenre;
      }

      const response = await axios.get(`${tmdbBaseUrl}${endpoint}`, { headers: tmdbHeaders(), params });
      if (response.data?.results) {
        const languageFilteredResults =
          selectedLanguage === 'all'
            ? response.data.results
            : response.data.results.filter((item) => item.original_language === selectedLanguage);
        const sortedPageMovies = [...languageFilteredResults].sort((a, b) => {
          const aYear = getReleaseYear(a.release_date || a.first_air_date);
          const bYear = getReleaseYear(b.release_date || b.first_air_date);
          return bYear - aYear;
        });
        setMovies(sortedPageMovies);
        setTotalResults(selectedLanguage === 'all' ? response.data.total_results || 0 : sortedPageMovies.length);
      } else {
        setMovies([]);
        setTotalResults(0);
        setApiMessage('No movies found.');
      }
    } catch (error) {
      console.error('Error fetching movies from TMDb', error);
      setMovies([]);
      setTotalResults(0);
      setApiMessage('Unable to fetch movies. Please verify TMDb access token.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedGenre, selectedLanguage, selectedYear]);

  useEffect(() => {
    fetchMovies(effectiveQuery, selectedType, selectedYear, currentPage);
  }, [effectiveQuery, selectedType, selectedYear, currentPage, fetchMovies]);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setPage(currentPage + 1);
    }
  };

  const handlePageClick = (page) => {
    setPage(page);
  };

  const handleClearFilters = () => {
    const nextType = 'movie';
    const nextYear = 'all';
    const nextGenre = 'all';
    const nextLanguage = 'all';
    setSelectedType(nextType);
    setSelectedYear(nextYear);
    setSelectedGenre(nextGenre);
    setSelectedLanguage(nextLanguage);
    updateFilterParams(nextType, nextYear, nextGenre, nextLanguage);
    setPage(1);
  };

  const renderPagination = () => {
    if (totalPages <= 1) {
      return null;
    }

    const pages = [];
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    pages.push(
      <button type="button" key="prev" className="page page-btn" disabled={currentPage === 1} onClick={handlePrevPage}>
        Previous
      </button>
    );

    if (startPage > 1) {
      pages.push(
        <button type="button" key={1} className={`page ${currentPage === 1 ? 'current' : ''}`} onClick={() => handlePageClick(1)}>
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(
          <span key="start-ellipsis" className="page-ellipsis">
            ...
          </span>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button type="button" key={i} className={`page ${i === currentPage ? 'current' : ''}`} onClick={() => handlePageClick(i)}>
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="end-ellipsis" className="page-ellipsis">
            ...
          </span>
        );
      }
      pages.push(
        <button
          type="button"
          key={totalPages}
          className={`page ${currentPage === totalPages ? 'current' : ''}`}
          onClick={() => handlePageClick(totalPages)}
        >
          {totalPages}
        </button>
      );
    }

    pages.push(
      <button type="button" key="next" className="page page-btn" disabled={currentPage === totalPages} onClick={handleNextPage}>
        Next
      </button>
    );

    return pages;
  };

  return (
    <section className="home-page">
      {!searchQuery.trim() && (
        <div className="empty-state">
          <h2>Discover your next movie</h2>
          <p>Showing latest releases. Use the search bar to find specific titles.</p>
        </div>
      )}

      <div className="filter-row">
        {typeFilters.map((item) => (
          <button
            key={item.key}
            className={`filter-pill ${selectedType === item.key ? 'active' : ''}`}
            onClick={() => {
              setSelectedType(item.key);
              updateFilterParams(item.key, selectedYear, selectedGenre, selectedLanguage);
            }}
          >
            {item.label}
          </button>
        ))}
        <select className="year-filter" value={selectedYear} onChange={(e) => {
          const value = e.target.value;
          setSelectedYear(value);
          updateFilterParams(selectedType, value, selectedGenre, selectedLanguage);
        }}>
          <option value="all">All Years</option>
          {availableYears.map((year) => (
            <option key={year} value={String(year)}>
              {year}
            </option>
          ))}
        </select>
        <select className="year-filter" value={selectedGenre} onChange={(e) => {
          const value = e.target.value;
          setSelectedGenre(value);
          updateFilterParams(selectedType, selectedYear, value, selectedLanguage);
        }}>
          <option value="all">All Genres</option>
          {genreOptions.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>
        <select className="year-filter" value={selectedLanguage} onChange={(e) => {
          const value = e.target.value;
          setSelectedLanguage(value);
          updateFilterParams(selectedType, selectedYear, selectedGenre, value);
        }}>
          {languageOptions.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.label}
            </option>
          ))}
        </select>
        <button type="button" className="filter-pill clear-filters" onClick={handleClearFilters}>
          Clear Filters
        </button>
      </div>
      <div className="results-toolbar">
        <span className="results-count">Total results: {totalResults}</span>
      </div>
      {activeFilters.length > 0 && (
        <div className="active-filters">
          {activeFilters.map((filter) => (
            <span key={filter} className="active-chip">
              {filter}
            </span>
          ))}
        </div>
      )}
      <div className="status-message">Showing TMDb latest releases with pagination</div>

      {isLoading && <div className="status-message">Loading movies...</div>}
      {!isLoading && movies.length === 0 && <div className="status-message">{apiMessage || 'No movies found.'}</div>}

      <div className="movie-grid">
        {isLoading &&
          Array.from({ length: 8 }).map((_, index) => (
            <div key={`skeleton-${index}`} className="card1 skeleton-card">
              <div className="skeleton-img" />
              <div className="skeleton-line long" />
              <div className="skeleton-line short" />
              <div className="skeleton-btn" />
            </div>
          ))}
        {!isLoading && filteredMovies.map((movie, index) => (
          <Card key={index} className="card1">
            <Card.Img
              id="homeimage"
              className="images"
              src={movie.poster_path ? `${tmdbImageBase}${movie.poster_path}` : fallbackPoster}
              alt={`${movie.title || movie.name} poster`}
              loading="lazy"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = fallbackPoster;
              }}
            />
            <Card.Body className="details">
              <Card.Title style={{ background: 'transparent' }}>
                <h4>{(movie.title || movie.name || '').slice(0, 22)}</h4>
              </Card.Title>
              <Card.Text className="overview">
                Year: {getReleaseYear(movie.release_date || movie.first_air_date) || 'N/A'}
              </Card.Text>
              <Link state={{ movieId: movie.id, mediaType: selectedType }} to={`/details/${movie.id}`}>
                <Button className="readmore">Read More</Button>
              </Link>
            </Card.Body>
          </Card>
        ))}
      </div>
      <div className='pagination'>
        {renderPagination()}
      </div>
    </section>
  );
};

export default Home;
