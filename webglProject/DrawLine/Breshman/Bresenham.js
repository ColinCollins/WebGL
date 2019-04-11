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
    方案 bresenham 算法和 DDA 接近  核心内容为去除浮点运算方案同时改用逐加步长。
    (-2dx + 2dy > dx?) -> (-dx + dy / dx > 0.5)

    留一个 count 记录当前 y 的长度
*/
function drawLine (linePoint, ctx, rect) {
    // init
    ctx.clearRect(0, 0, rect.width, rect.height);
    drawGrid(rect, ctx);

    let dy = linePoint[0].y - linePoint[1].y;
    let dx = linePoint[0].x - linePoint[1].x

    let absX = Math.abs(dx);
    let absY = Math.abs(dy);

    let incX = absX > absY ? 1 : 0;
    let incY = absX > absY ? 0 : 1;

    let step = absX > absY ? absX : absY;    
    let sort = absX > absY ? sortX : sortY;
    linePoint = linePoint.sort(sort);
    
    ctx.fillStyle = '#808B96';
    
    let count = 0;
    for (let i = 0; i <= step; i++) {
        let pos = null;
        let temp = count;
        if (absX > absY) {
            if ((2 * i * absY) - (2 * count * absX) > absX) {
                incY = dx * dy > 0 ? 1 : -1;
                temp = count++;
            }
            pos = {
                x: linePoint[0].x + incX * i,
                y: linePoint[0].y + incY + (temp * incY)
            };
        }
        else {
            if ((2 * i * absX) - (2 * count * absY) > absY) {
                incX = dx * dy > 0 ? 1 : -1;
                temp = count++;
            }
            pos = {
                x: linePoint[0].x + incX + (temp * incX),
                y: linePoint[0].y + incY * i
            };
        }
        
        ctx.fillRect(pos.x * GRID, pos.y * GRID, GRID, GRID);
    }
    return;
}

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
}