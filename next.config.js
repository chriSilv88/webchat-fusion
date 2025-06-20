const customConfig = {
  async rewrites() {
    return [
      {
        source: '/backend/:resource*',
        destination:
          process.env.NODE_ENV === 'development'
            ? 'http://localhost:8000/backend/:resource*'
            : '/api/:resource*',
      },
      {
        source: '/documentazione',
        destination:
          process.env.NODE_ENV === 'development'
            ? 'http://localhost:8000/docs'
            : '/api/docs',
      },
      {
        source: '/schema-api',
        destination:
          process.env.NODE_ENV === 'development'
            ? 'http://localhost:8000/openapi.json'
            : '/api/openapi.json',
      },
    ];
  },
};

module.exports = customConfig;
