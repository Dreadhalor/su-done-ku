import {
  Cell,
  Elimination,
  Step,
  getGroups,
  getQuads,
  getRegions,
  getRemovedValues,
} from '..';

export const hiddenQuads = (board: Cell[][]) => {
  const step: Step = {
    type: 'hiddenQuads',
    boardSnapshot: JSON.parse(JSON.stringify(board)),
    eliminations: [],
  };
  const regions = getRegions(board);
  regions.forEach(({ cells }) => {
    // any hint value with more than 4 cells or less than 2 can't be part of a hidden quad, so we can ignore it
    // const candidateQuads = getQuads(cells);
    const candidateQuads = getGroups(cells, [2, 3, 4], 4);
    console.log(candidateQuads);
    candidateQuads.forEach(({ group, cells }) => {
      if (cells.length !== 4) return;
      const nakedQuad = cells.every((cell) => cell.hintValues.length <= 4);
      if (nakedQuad) return;
      const referenceValues = group;
      const modifiedCells = cells.filter((cell) =>
        cell.hintValues.some((hint) => referenceValues.includes(hint)),
      );
      const removedValues = getRemovedValues(cells, referenceValues);
      const elimination = {
        referenceCells: cells,
        referenceValues,
        modifiedCells,
        removedValues,
      } as Elimination;
      step.eliminations.push(elimination);
    });
  });

  return step;
};

// export const hiddenQuads = (board: Cell[][]) => {
//   const step: Step = {
//     type: 'hiddenQuads',
//     boardSnapshot: JSON.parse(JSON.stringify(board)),
//     eliminations: [],
//   };
//   const regions = getRegions(board);
//   regions.forEach(({ cells }) => {
//     // any hint value with more than 4 cells or less than 2 can't be part of a hidden quad, so we can ignore it
//     const candidateQuads = filterHintCounts(cells, [2, 3, 4]);
//     getQuads(cells);
//     for (let i = 0; i < candidateQuads.length - 3; i++) {
//       for (let j = i + 1; j < candidateQuads.length - 2; j++) {
//         for (let k = j + 1; k < candidateQuads.length - 1; k++) {
//           for (let l = k + 1; l < candidateQuads.length; l++) {
//             const { hint: hint1, cells: cells1 } = candidateQuads[i]!;
//             const { hint: hint2, cells: cells2 } = candidateQuads[j]!;
//             const { hint: hint3, cells: cells3 } = candidateQuads[k]!;
//             const { hint: hint4, cells: cells4 } = candidateQuads[l]!;
//             const uniqueCells = new Set([
//               ...cells1,
//               ...cells2,
//               ...cells3,
//               ...cells4,
//             ]);
//             if (uniqueCells.size !== 4) continue;
//             const [a_0, a_1, a_2, a_3] = [...uniqueCells];
//             // if no cells have more than 4 hint values, they're a naked quad & we have no inner value to eliminate
//             if (
//               a_0!.hintValues.length <= 4 &&
//               a_1!.hintValues.length <= 4 &&
//               a_2!.hintValues.length <= 4 &&
//               a_3!.hintValues.length <= 4
//             )
//               continue;
//             const referenceValues = [
//               Number(hint1),
//               Number(hint2),
//               Number(hint3),
//               Number(hint4),
//             ];
//             // only cells that have hint values that aren't part of the quad are modified
//             const modifiedCells = [a_0, a_1, a_2, a_3].filter(
//               (cell) =>
//                 cell &&
//                 cell.hintValues.some((hint) => referenceValues.includes(hint)),
//             );
//             const removedValues = [
//               ...new Set([
//                 ...a_0!.hintValues.filter(
//                   (hint) => !referenceValues.includes(hint),
//                 ),
//                 ...a_1!.hintValues.filter(
//                   (hint) => !referenceValues.includes(hint),
//                 ),
//                 ...a_2!.hintValues.filter(
//                   (hint) => !referenceValues.includes(hint),
//                 ),
//                 ...a_3!.hintValues.filter(
//                   (hint) => !referenceValues.includes(hint),
//                 ),
//               ]),
//             ];
//             const elimination = {
//               referenceCells: [a_0, a_1, a_2, a_3],
//               referenceValues,
//               modifiedCells,
//               removedValues,
//             } as Elimination;
//             step.eliminations.push(elimination);
//           }
//         }
//       }
//     }
//   });

//   return step;
// };
