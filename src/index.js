const express = require('express');
const cors = require('cors')
const db = require('./config/db')
const userRouter = require('./routes/user');
const hrRouter = require('./routes/hr')
const employeeRouter = require('./routes/employee')
const auth = require('./routes/auth')
const documentRouter = require('./routes/documents')

require('dotenv').config();
const app = express();
const port = 5000;


app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
db()
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/api', auth);
app.use('/api/users', userRouter);
app.use('/api/hr', hrRouter);
app.use('/api/employee', employeeRouter);
app.use('/api/documents', documentRouter)


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
