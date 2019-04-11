const GRID = 10;

function main() {
    const canvas = document.getElementById('canvas');
    let ctx = canvas.getContext('2d');
    let rect = canvas.getBoundingClientRect();
    // init canvas
    drawGrid(rect, ctx);
    
    let points = [];
    canvas.onmousedown = (handle) => {
        let pos =  {
            x: Math.ceil((handle.x - rect.x) / GRID) - 1, 
            y: Math.ceil((handle.y - rect.y) / GRID) - 1
        };
        console.log(`pos: ${pos.x} + ${pos.y}`);

        points.push(pos);
        if (points.length === 2) {
            drawLine(points, ctx, rect);
            points.length = 0;
        }
    }
}

function drawGrid (rect, ctx) {
    let sizeX = rect.width / GRID;
    let sizeY = rect.height / GRID;

    ctx.strokeStyle = '#F5B7B1';
    for (let i = 0; i < sizeX; i++) {
        for(let j = 0; j < sizeY; j++) {
            let x = i * GRID;
            let y = j * GRID;
            ctx.strokeRect(x, y, GRID, GRID);
        }
    }
}
/* 
    方案 设计初期先运算了 tan 导致出现了多余的判断，
    同时计算线段的过程也比较的繁琐，使用了递归的方式拿空间也没有换到多少时间。
    那么在正常情况下我们优先考虑的是循环而不是递归。
*/
function drawLine (linePoint, ctx, rect) {
    // init
    ctx.clearRect(0, 0, rect.width, rect.height);
    drawGrid(rect, ctx);

    let dy = linePoint[0].y - linePoint[1].y;
    let dx = linePoint[0].x - linePoint[1].x

    let absX = Math.abs(dx);
    let absY = Math.abs(dy);

    // tan = dy / dx
    let step = absX > absY ? absX : absY;
    ctx.fillStyle = '#808B96';

    for (let i = 0; i <= step; i++) {
        let pos = {
            x: Math.ceil(linePoint[0].x - (i * dx / step)),
            y: Math.ceil(linePoint[0].y - (i * dy / step))    
        };
        ctx.fillRect(pos.x * GRID, pos.y * GRID, GRID, GRID);
    }
    return;
}

/* function calculateLineX (pos1, pos2, tan, lines) {
    if (pos1.x > pos2.x) {
        console.log('Done!');
        return;
    }
    lines.push({x: Math.ceil(pos1.x), y: Math.ceil(pos1.y)});
    pos1 = {
        x: pos1.x + 1,
        y: pos1.y + tan
    }
    calculateLineX(pos1, pos2, tan, lines);
    return;
}

function calculateLineY (pos1, pos2, tan, lines) {
    if (pos1.y > pos2.y) {
        console.log('Done!');
        return;
    }
    lines.push({x: Math.ceil(pos1.x), y: Math.ceil(pos1.y)});
    pos1 = {
        x: pos1.x + tan,
        y: pos1.y + 1
    }
    calculateLineY(pos1, pos2, tan, lines);
    return;
}
// sort the point
function sortX (a, b) {
    if (a.x < b.x) {
        return -1;
    }
    else if (a.x === b.x && a.y < b.y) {
        return -1;
    }
    return 1;
}

function sortY (a, b) {
    if (a.y < b.y) {
        return -1;
    }
    else if (a.y === b.y && a.x < b.x) {
        return -1;
    }
    return 1;
} */