require('dotenv').config();
require('express-async-errors');
const express = require('express');
const helmet=require('helmet')
const cors=require('cors')
const xss=require('xss-clean')
const ratelimit=require('express-rate-limit')

const app = express();

const prodRouter=require('./routes/product')
const authRouter=require('./routes/auth')
const cartRouter=require('./routes/cart')
const authenticateUser=require('./middleware/authentication')

const connectDB=require('./db/connect')
// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.set('trust proxy',1)
app.use(ratelimit(
{
  windowMs:15*60*1000,
  max:100
}
))
app.use(express.json());
app.use(helmet())
app.use(cors())
app.use(xss())

// extra packages

// routes
app.get('/', (req, res) => {
  res.send('appleute');
});

app.use('/api/v1/auth',authRouter)
app.use('/api/v1/prod',prodRouter)
app.use('/api/v1/cart',authenticateUser,cartRouter)

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGOOSE_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
