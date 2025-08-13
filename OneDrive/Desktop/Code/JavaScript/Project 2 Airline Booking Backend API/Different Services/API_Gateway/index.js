const express = require('express');
const morgan = require('morgan');
const { createProxyMiddleware } = require('http-proxy-middleware');
// the above line here means that we're only taking the createProxyMiddleware()
const rateLimit = require('express-rate-limit');
const app = express();
const axios = require('axios');

const PORT = 3005;

const limiter = rateLimit({
	windowMs: 20 * 1000, 
	limit: 2, 
    message: 'you have reached the limit '

})

app.use(limiter);
app.use(morgan('combined'));

app.use('/bookingservice', (req, res, next) => {
 // console.log(req.headers['x-access-token']);
  try {
    const response = axios.get('http://localhost:3001/api/v1/isAuthenticated', {
      headers: {
        'x-access-token': req.headers['x-access-token']
      }
    });
    console.log(response.data);
    if(response.data.success) {
      next();
    } else {
      return res.status(401).json({
        message: 'Unauthorised'
      })
    }
  } catch (error) {
      return res.status(401).json({
        message: 'Unauthorised'
      })
  }
});

app.use(
  '/bookingservice',
  createProxyMiddleware({
    // This will proxy requests from /bookingservice/* to the booking service,
    // automatically removing the /bookingservice prefix.
    target: 'http://localhost:3002',
    changeOrigin: true,
  })
);
  
app.get('/home', (req, res) => {
    return res.json({message: 'OK'});
})

app.listen(PORT, () => {
    console.log(`Server started at ${PORT}`);
});