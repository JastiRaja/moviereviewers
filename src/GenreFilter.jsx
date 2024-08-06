import React from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';

const GenreFilter = ({ genres, selectedGenres, onGenreChange }) => {
  return (
    <div className='genre-filter'>
      <ButtonGroup>
        {genres.map(genre => (
          <Button
            key={genre.id}
            variant={selectedGenres.includes(genre.id) ? 'primary' : 'secondary'}
            onClick={() => onGenreChange(genre.id)}
          >
            {genre.name}
          </Button>
        ))}
      </ButtonGroup>
    </div>
  );
};

export default GenreFilter;
