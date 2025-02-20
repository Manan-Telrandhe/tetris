
const canvas = document.getElementById("gamecanvas");

const context = canvas.getContext("2d");

const scoredisplay = document.getElementById("score");

const row = 20;
const col = 10;
const size = 30;

const board = Array.from({ length: row }, () => Array(col).fill(0));

let currentshape, gameover = false;
let score=0;

// tetromino shape
const shapes = [
    [[1, 1, 1, 1]],  // I
    [[1, 1], [1, 1]], // O
    [[0, 1, 0], [1, 1, 1]], // T
    [[1, 1, 0], [0, 1, 1]], // S
    [[0, 1, 1], [1, 1, 0]], // Z
    [[1, 0, 0], [1, 1, 1]], // J
    [[0, 0, 1], [1, 1, 1]]  // L
];

function draw(x, y, color) {
    context.fillStyle = color;
    context.fillRect(x * size, y * size, size, size);
    context.strokeStyle = "black";
    context.strokeRect(x * size, y * size, size, size);
}

function drawboard() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < row; y++) {
        for (let x = 0; x < col; x++) {
            if (board[y][x]) {
                draw(x, y, "white");
            }
        }
    }
}

function randomshape() {
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    return { shape, x: 3, y: 0 };
}

function place() {
    currentshape.shape.forEach((row, rowindex) => {
        row.forEach((value, colindex) => {
            if (value) board[currentshape.y + rowindex][currentshape.x + colindex] = 1;
        });
    });
    currentshape = randomshape();
    if (collides(currentshape.x, currentshape.y, currentshape.shape)) {
        gameover = true;
        alert("Game Over the board has been filled");
    }
}

function collides(x, y, shape) {
    return shape.some((row, rowindex) =>
        row.some((value, colindex) =>
            value && (board[y + rowindex] && board[y + rowindex][x + colindex]) !== 0
        )
    );
}

function move(colindex, rowindex) {
    if (!collides(currentshape.x + colindex, currentshape.y + rowindex, currentshape.shape)) {
        currentshape.x += colindex;
        currentshape.y += rowindex;
    } else if (rowindex > 0) {
        place();
        clearlines();
    }
}

function rotate() {
    const rotated = currentshape.shape[0].map((_, i) =>
        currentshape.shape.map(row => row[i]).reverse()
    );
    if (!collides(currentshape.x, currentshape.y, rotated)) {
        currentshape.shape = rotated;
    }
}

function clearlines() {
    let linescleared = 0;
    for (let y = row - 1; y >= 0; y--) {
        if (board[y].every(cell => cell !== 0)) {
            board.splice(y, 1); 
            board.unshift(Array(col).fill(0));

            linescleared++;
        }
    }

    if(linescleared>0){
        score+=linescleared*10;
        scoredisplay.textContent=score;
    }
}

document.addEventListener("keydown", (event) => {
    if (gameover) return;
    if (event.key === "ArrowLeft") move(-1, 0);
    else if (event.key === "ArrowRight") move(1, 0);
    else if (event.key === "ArrowDown") move(0, 1);
    else if (event.key === "ArrowUp") rotate();
});

function update() {
    if (!gameover) {
        move(0, 1);
        drawboard();
        currentshape.shape.forEach((row, rowindex) => {
            row.forEach((value, colindex) => {
                if (value) draw(currentshape.x + colindex, currentshape.y + rowindex, "grey");
            });
        });
        setTimeout(update, 500);
    }
}

currentshape = randomshape();

update();
