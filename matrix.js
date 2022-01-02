var Tool = {
    "pen": 0,
    "eraser": 1,
    "fillBucket": 2,
    "line": 3,
    "circle": 4,
    "ellipse": 5,
    "addFrame": 6,
    "undo": 7,
    "redo": 8,
    "clearCanvas": 9
};
var tools = [true, false, false, false, false, false];
var lc = [];

function createProject(width, height) {
    if (window.board === undefined) {
        window.board = new Canvas(width, height);
    }
    window.board.canvas.width = 10 * width;//display each pixel in 10 by 10pxs
    window.board.canvas.height = 10 * height;
    window.board.width = width;
    window.board.height = height;
    window.board.canvas.style.display = "block";
    window.board.canvas.style.height = Math.floor((height / width) * window.board.canvas.clientWidth) + "px";
    window.board.w = +window.board.canvas.width;
    window.board.h = +window.board.canvas.height;
    window.board.ctx = window.board.canvas.getContext("2d");
    window.board.ctx.fillStyle = "black";
    window.board.ctx.globalAlpha = 1;
    window.board.ctx.fillRect(0, 0, window.board.w, window.board.h);
    window.board.data = [...Array(window.board.width)].map(e => Array(window.board.height).fill([0, 0, 0, 255]));
    window.board.steps = [];
    window.board.redo_arr = [];
    window.board.frames = [];

    window.board.setcolor([255, 255, 255, 255]);
    if (window.dim) {
        window.dim.close();
    }
    window.gif = new GIF({
        workers: 2,
        quality: 10,
        width: 10 * window.board.width,
        height: 10 * window.board.height
    });
    window.gif.on('finished', function (blob) {
        var url = URL.createObjectURL(blob);
        var link = document.createElement('a');
        link.download = 'canvas.gif';
        link.href = url;
        link.click();
    });
    window.board.addFrame();
}

function newProject() {
    localStorage.removeItem('pc-canvas-data');
    window.colors = [

        [255, 255, 255, 255],
        [0, 0, 0, 255],
        [0, 255, 255, 255],
        [0, 0, 255, 255],
        [0, 0, 128, 255],
        [0, 128, 128, 255],
        [0, 128, 0, 255],
        [0, 255, 0, 255],
        [255, 0, 0, 255],
        [128, 0, 0, 255],
        [128, 0, 128, 255],
        [255, 0, 255, 255],
        [255, 255, 0, 255],
        [192, 192, 192, 255],
        [128, 128, 128, 255]
    ];
    createProject(16, 16);
}

function filler(x, y, cc) {
    if (x >= 0 && x < board.width && y >= 0 && y < board.height) {
        if (JSON.stringify(board.data[x][y]) === JSON.stringify(cc) && JSON.stringify(board.data[x][y]) !== JSON.stringify(board.color)) {
            board.draw(x, y);
            filler(x + 1, y, cc);
            filler(x, y + 1, cc);
            filler(x - 1, y, cc);
            filler(x, y - 1, cc);
        }
    }
}

function hexToRgba(hex) {
    const r = parseInt(hex.substr(1, 2), 16)
    const g = parseInt(hex.substr(3, 2), 16)
    const b = parseInt(hex.substr(5, 2), 16)
    return [r, g, b, 1];
}

function highlightSelectedColor(clr) {
    document.querySelectorAll("#palette .item").forEach(x => x.style.boxShadow = "");
    clr.style.boxShadow = "10px 10px 10px 10px rgba(0,0,0,0.5)";
}

window.onload = function () {
    newProject();
    Palette.populate();
    Frames.load();
}