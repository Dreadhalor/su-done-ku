import express from 'express';
import randomRouter from './routes/random';

const app = express();
const PORT = process.env.PORT || 3000;

// Use the random puzzle route
app.use('/api/puzzle/random', randomRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
