const axios = require('axios');

module.exports = async (req, res) => {
  try {
    const apiKey = 'dd21959285ddf157a57f694a5f6fdcde';
    const { path, query } = req.query;
    
    const tmdbUrl = `https://api.themoviedb.org/3${path}`;
    const response = await axios.get(tmdbUrl, {
      params: { ...query, api_key: apiKey }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Failed to fetch data from TMDB' });
  }
}; 