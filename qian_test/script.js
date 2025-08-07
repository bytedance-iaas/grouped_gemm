document.addEventListener('DOMContentLoaded', () => {
    const boardElement = document.getElementById('sudoku-board');
    const checkBtn = document.getElementById('check-btn');
    const newGameBtn = document.getElementById('new-game-btn');
    let board = [];

    function generateSudoku() {
        board = Array(9).fill(null).map(() => Array(9).fill(0));
        solveSudoku(board); // Generate a full solution
        removeNumbers(board); // Remove numbers to create a puzzle
        displayBoard(board);
    }

    function solveSudoku(board) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (board[row][col] === 0) {
                    const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
                    shuffle(nums);
                    for (let num of nums) {
                        if (isValid(board, row, col, num)) {
                            board[row][col] = num;
                            if (solveSudoku(board)) {
                                return true;
                            }
                            board[row][col] = 0;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

    function isValid(board, row, col, num) {
        for (let i = 0; i < 9; i++) {
            if (board[row][i] === num || board[i][col] === num) {
                return false;
            }
        }
        const startRow = Math.floor(row / 3) * 3;
        const startCol = Math.floor(col / 3) * 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[startRow + i][startCol + j] === num) {
                    return false;
                }
            }
        }
        return true;
    }

    function removeNumbers(board, difficulty = 40) {
        let attempts = difficulty;
        while (attempts > 0) {
            let row = Math.floor(Math.random() * 9);
            let col = Math.floor(Math.random() * 9);
            if (board[row][col] !== 0) {
                board[row][col] = 0;
                attempts--;
            }
        }
    }

    function displayBoard(board) {
        boardElement.innerHTML = '';
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                if (board[row][col] !== 0) {
                    cell.textContent = board[row][col];
                    cell.classList.add('fixed');
                } else {
                    const input = document.createElement('input');
                    input.type = 'text';
                    input.maxLength = 1;
                    input.dataset.row = row;
                    input.dataset.col = col;
                    input.addEventListener('input', handleInput);
                    cell.appendChild(input);
                }
                 if (row % 3 === 2 && row < 8) {
                    cell.style.borderBottom = '2px solid black';
                }
                if (col % 3 === 2 && col < 8) {
                    cell.style.borderRight = '2px solid black';
                }
                boardElement.appendChild(cell);
            }
        }
    }

    function handleInput(e) {
        const input = e.target;
        const value = input.value;
        const row = input.dataset.row;
        const col = input.dataset.col;

        if (!/^[1-9]$/.test(value) && value !== '') {
            input.value = '';
            board[row][col] = 0;
            return;
        }

        board[row][col] = value === '' ? 0 : parseInt(value);
    }

    function shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    }

    newGameBtn.addEventListener('click', generateSudoku);
    checkBtn.addEventListener('click', checkSolution);

    function checkSolution() {
        // Check if the board is fully filled
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (board[row][col] === 0) {
                    alert('The board is not complete!');
                    return;
                }
            }
        }

        // Check for duplicates in rows, columns, and 3x3 subgrids
        for (let i = 0; i < 9; i++) {
            const rowSet = new Set();
            const colSet = new Set();
            const subgridSet = new Set();
            for (let j = 0; j < 9; j++) {
                // Check row
                const rowVal = board[i][j];
                if (rowSet.has(rowVal)) {
                    alert(`Incorrect solution! Duplicate number ${rowVal} in row ${i + 1}.`);
                    return;
                }
                rowSet.add(rowVal);

                // Check column
                const colVal = board[j][i];
                if (colSet.has(colVal)) {
                    alert(`Incorrect solution! Duplicate number ${colVal} in column ${i + 1}.`);
                    return;
                }
                colSet.add(colVal);

                // Check 3x3 subgrid
                const subgridRow = 3 * Math.floor(i / 3) + Math.floor(j / 3);
                const subgridCol = 3 * (i % 3) + (j % 3);
                const subgridVal = board[subgridRow][subgridCol];
                if (subgridSet.has(subgridVal)) {
                    alert(`Incorrect solution! Duplicate number ${subgridVal} in a subgrid.`);
                    return;
                }
                subgridSet.add(subgridVal);
            }
        }

        alert('Congratulations! You have solved the puzzle correctly!');
    }

    // Initial board generation
    generateSudoku();
});
