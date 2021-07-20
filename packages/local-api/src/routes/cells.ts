import express from 'express';
import fs from 'fs/promises';
import path from 'path';

interface Cell {
  id: string;
  content: string;
  type: 'text' | 'code';
}

const cellSamples = [
  {
    id: '0',
    type: 'text',
    content:
      'This is tool for make code notes. It is text note. **Click to edit.**\n\nYou can see code note below. Edit code and see preview on right block.\nYou can use show() function to view render.',
  },
  {
    id: '1',
    type: 'code',
    content: "import React from 'react';\r\n\r\nshow(<div>Rendered</div>);",
  },
];

export const createCellsRouter = (filename: string, dir: string) => {
  const router = express.Router();
  router.use(express.json());

  const fullPath = path.join(dir, filename);

  router.get('/cells', async (req, res) => {
    try {
      const result = await fs.readFile(fullPath, { encoding: 'utf-8' });

      res.send(JSON.parse(result));
    } catch (err) {
      if (err.code === 'ENOENT') {
        await fs.writeFile(fullPath, JSON.stringify(cellSamples), 'utf-8');
        res.send(cellSamples);
      } else {
        throw err;
      }
    }
    // Make sure the cell storage file exists
    // If it does not exist, add in a default list of cells
    // Read the file
    // Parse a list of cells out of it
    // Send list of cells back to browser
  });

  router.post('/cells', async (req, res) => {
    const { cells }: { cells: Cell[] } = req.body;

    await fs.writeFile(fullPath, JSON.stringify(cells, null, 2), 'utf-8');

    res.send({ status: 'ok' });
  });

  return router;
};
