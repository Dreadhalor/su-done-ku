import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();

type Puzzle = {
  sha: string;
  rating: string;
  puzzle: string;
};
const difficulties = ['easy', 'medium', 'hard'] as const;
type DifficultySetting = (typeof difficulties)[number];

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
const getRandomPuzzleWithDifficulty = async (difficulty: DifficultySetting) => {
  const filePath = path.join(__dirname, `../puzzles/${difficulty}.txt`);
  return await getRandomPuzzle(filePath);
};

router.get('/', async (req: Request, res: Response) => {
  try {
    const { difficulty } = req.query;
    if (difficulty && difficulties.includes(difficulty as DifficultySetting)) {
      const puzzle = await getRandomPuzzleWithDifficulty(
        difficulty as DifficultySetting,
      );
      res.json({ difficulty, puzzle });
    } else {
      // no/invalid difficulty provided, just pick a random puzzle
      const randomDifficulty =
        difficulties[Math.floor(Math.random() * difficulties.length)];
      const filePath = path.join(
        __dirname,
        `../puzzles/${randomDifficulty}.txt`,
      );
      const puzzle = await getRandomPuzzle(filePath);
      res.json({ difficulty: randomDifficulty, puzzle });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while fetching a puzzle.');
  }
});

export default router;
