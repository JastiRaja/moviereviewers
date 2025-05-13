const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// Proxy endpoint for TMDB API
app.get('/api/*', async (req, res) => {
  try {
    const apiKey = 'dd21959285ddf157a57f694a5f6fdcde';
    const tmdbUrl = `https://api.themoviedb.org/3${req.path.replace('/api', '')}`;
    const response = await axios.get(tmdbUrl, {
      params: { ...req.query, api_key: apiKey }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Failed to fetch data from TMDB' });
  }
});

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 