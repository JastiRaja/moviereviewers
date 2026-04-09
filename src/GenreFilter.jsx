import React from 'react';

const GenreFilter = ({ genres, selectedGenres, onGenreChange }) => {
  return (
    <div className='genre-filter'>
      <select
        className='genre-dropdown'
        value={selectedGenres[0] || ''}
        onChange={e => onGenreChange(Number(e.target.value))}
      >
        <option value=''>All Genres</option>
        {genres.map(genre => (
          <option key={genre.id} value={genre.id}>
            {genre.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default GenreFilter;
