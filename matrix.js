class Matrix {

    static createProject(width, height) {
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

    static newProject() {
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
        this.createProject(16, 16);
    }
}

window.onload = function () {
    Matrix.newProject();
    Palette.populate();
    Frames.load();
}