import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();

type Puzzle = {
  sha: string;
  rating: string;
  puzzle: string;
};

// Utility function to read puzzles from a file and select a random one
const getRandomPuzzle = (filePath: string): Promise<Puzzle> => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, { encoding: 'utf-8' }, (err, data) => {
      if (err) {
        return reject(err);
      }

      const lines = data.trim().split('\n');
      const randomLine = lines[Math.floor(Math.random() * lines.length)];
      const [sha, puzzle, rating] = randomLine
        .split(' ')
        .filter((predicate) => predicate !== '');
      resolve({ sha, rating, puzzle });
    });
  });
};
const getRandomPuzzleWithDifficulty = async (difficulty: string) => {
  const filePath = path.join(__dirname, `../puzzles/${difficulty}.txt`);
  return await getRandomPuzzle(filePath);
};

// Route to get a random puzzle
router.get('/', async (req: Request, res: Response) => {
  try {
    const difficulties = ['easy', 'medium', 'hard'];
    const randomDifficulty =
      difficulties[Math.floor(Math.random() * difficulties.length)];
    const filePath = path.join(__dirname, `../puzzles/${randomDifficulty}.txt`);

    const puzzle = await getRandomPuzzle(filePath);
    res.json({ difficulty: randomDifficulty, puzzle });
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while fetching a puzzle.');
  }
});

// Route to get an easy puzzle
router.get('/easy', async (req: Request, res: Response) => {
  try {
    const difficulty = 'easy';
    const puzzle = await getRandomPuzzleWithDifficulty(difficulty);
    res.json({ difficulty, puzzle });
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while fetching a puzzle.');
  }
});

// Route to get a medium puzzle
router.get('/medium', async (req: Request, res: Response) => {
  try {
    const difficulty = 'medium';
    const puzzle = await getRandomPuzzleWithDifficulty(difficulty);
    res.json({ difficulty, puzzle });
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while fetching a puzzle.');
  }
});

// Route to get a hard puzzle
router.get('/hard', async (req: Request, res: Response) => {
  try {
    const difficulty = 'hard';
    const puzzle = await getRandomPuzzleWithDifficulty(difficulty);
    res.json({ difficulty, puzzle });
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while fetching a puzzle.');
  }
});

export default router;
