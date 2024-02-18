import express from 'express';
import randomRouter from './routes/random';
import path from 'path';
import cors from 'cors';

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;

// Use the random puzzle route
app.use('/api/puzzle/random', randomRouter);

// Serve su-done-ku
app.use('/', express.static(path.join(__dirname, '../../frontend/dist')));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
