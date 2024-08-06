import React, { useState, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { AuthContext } from './AuthContext';

const AddReview = ({ movieId, fetchReviews }) => {
  const [content, setContent] = useState('');
  const { user } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('You need to log in to add a review.');
      return;
    }
    const review = {
      movieId,
      userId: user.id,
      author: user.username,
      content,
    };
    try {
      await axios.post('http://localhost:5000/reviews', review);
      setContent('');
      fetchReviews();
    } catch (error) {
      console.error('Error adding review', error);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className='reviews'>
      <Form.Group controlId="reviewContent">
        <Form.Label className='adding'>Add your Review:</Form.Label>
        <Form.Control
        className='addingReview'
          as="textarea"
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </Form.Group>
      <Button  type="submit" >
        Submit
      </Button>
    </Form>
  );
};

export default AddReview;
