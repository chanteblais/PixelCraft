class Canvas {

    tool = {
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
    tools = [true, false, false, false, false, false];
    
    constructor(width, height) {
        this.canvas = document.querySelector("#canvas");
        this.canvas.width = 10 * width;
        this.canvas.height = 10 * height;
        this.width = width;
        this.height = height;
        this.canvas.style.display = "block";
        this.canvas.style.height = Math.floor((height / width) * this.canvas.clientWidth) + "px";
        this.w = +this.canvas.width;
        this.h = +this.canvas.height;
        this.ctx = this.canvas.getContext("2d");
        this.ctx.fillStyle = "white";
        this.ctx.globalAlpha = 1;
        this.ctx.fillRect(0, 0, this.w, this.h);
        this.data = [...Array(this.width)].map(e => Array(this.height).fill([0, 0, 0, 255]));
        this.steps = [];
        this.setcolor([255, 255, 255, 255]);
        this.framesManager = new Frames(this.canvas, this.data, this)
        this.framesManager.addFrame();

        this.previous_point = new Point(undefined, undefined)

        // Moved on-click to on-mouse-up to tell the difference between a click and a mouse-drag + click
        this.canvas.addEventListener("mousemove", e => {
            if (this.active) {
                this.perform(e.clientX, e.clientY);
            }
        });
        this.canvas.addEventListener("touchmove", e => {
            this.perform(e.touches[0].clientX, e.touches[0].clientY)
        })

        this.canvas.addEventListener("mousedown", e => {
            this.previous_point = new Point(undefined, undefined)
            this.active = true;
            this.publish();
        });
        this.canvas.addEventListener("mouseup", e => {
            this.active = false
            if (this.previous_point.x !== undefined) {
                return; // Don't re-paint the last point in a streak
            }

            let rect = this.canvas.getBoundingClientRect();
            let x = e.clientX - rect.left;
            let y = e.clientY - rect.top;
            x = Math.floor(this.width * x / this.canvas.clientWidth);
            y = Math.floor(this.height * y / this.canvas.clientHeight);
            if (this.tools[this.tool.fillBucket]) {
                this.filler(x, y, this.data[x][y]);
            } else if (this.tools[this.tool.eraser]) {
                var temp = this.color;
                var tga = this.ctx.globalAlpha;
                this.setcolor([0, 0, 0, 255]);
                this.draw(x, y);
                this.setcolor(temp);
                this.ctx.globalAlpha = tga;
            } else {
                this.previous_point = new Point(x, y);
                this.draw(x, y);
            }
            this.publish();
        });
        this.framesManager.load();
    }

    filler(x, y, cc) {
        if (x >= 0 && x < board.width && y >= 0 && y < board.height) {
            if (JSON.stringify(board.data[x][y]) === JSON.stringify(cc) && JSON.stringify(board.data[x][y]) !== JSON.stringify(board.color)) {
                board.draw(x, y);
                this.filler(x + 1, y, cc);
                this.filler(x, y + 1, cc);
                this.filler(x - 1, y, cc);
                this.filler(x, y - 1, cc);
            }
        }
    }

    draw(x, y, count) {
        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
            this.data[x][y] = this.color;
            this.ctx.fillRect(Math.floor(x * (this.w / this.width)), Math.floor(y * (this.h / this.height)), Math.floor(this.w / this.width), Math.floor(this.h / this.height));
            if (!count && JSON.stringify(this.steps[this.steps.length - 1]) !== JSON.stringify([x, y, this.color, this.ctx.globalAlpha])) this.steps.push([x, y, this.color, this.ctx.globalAlpha]);
            this.framesManager.updateFrame();
        }
    }

    populate(img) {
        // var img = this.frames[f][1];
        var tmp_color = this.color;
        var tmp_alpha = this.ctx.globalAlpha;
        this.ctx.globalAlpha = 1;
        var i, j;
        for (i = 0; i < this.width; i++) {
            for (j = 0; j < this.height; j++) {
                this.setcolor(img[i][j]);
                this.draw(i, j);
            }
        }
        this.setcolor(tmp_color);
        this.ctx.globalAlpha = tmp_alpha;
    }

    erase(x, y) {
        let temp = this.color;
        let tga = this.ctx.globalAlpha;
        this.setcolor([0, 0, 0, 255]);
        this.draw(x, y);
        this.setcolor(temp);
        this.ctx.globalAlpha = tga;
    }

    rgbToHex(r, g, b) {
        if (r > 255 || g > 255 || b > 255)
            throw "Invalid color component";
        return "#" + ("000000" + ((r << 16) | (g << 8) | b).toString(16)).slice(-6);
    }

    getColor(x, y) {
        const p = document.querySelector("#canvas").getContext('2d').getImageData(Math.floor(x * (window.board.w / window.board.width)), Math.floor(y * (window.board.h / window.board.height)), Math.floor(window.board.w / window.board.width), Math.floor(window.board.h / window.board.height)).data;
        return this.rgbToHex(p[0], p[1], p[2]);
    }

    publish() {
        const frame = [];
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                frame.push(this.getColor(j, i));
            }
        }
        const payload = [];
        payload[0] = frame;
        fetch('http://localhost:3000/publish', {
            headers: {"Content-Type": "application/json"},
            method: 'POST',
            body: JSON.stringify({gif: false, payload: payload})
        })
    }

    setcolor(color) {
        this.ctx.globalAlpha = 1;
        this.color = color;
        this.ctx.fillStyle = "rgba(" + color[0] + "," + color[1] + "," + color[2] + "," + color[3] + ")";
    }

    setmode(i) {
        this.tools = [false, false, false, false, false, false];
        this.tools[i] = true;
        document.querySelectorAll("#toolbar .item").forEach((x, i) => {
            if (this.tools[i]) x.style.backgroundColor = "grey";
            else x.style.backgroundColor = "";
        })
    }

    save() {
        console.log("Saving")
        this.canvas.toBlob(function (blob) {
            var url = URL.createObjectURL(blob);
            var link = document.createElement('a');
            link.download = 'canvas.png';
            link.href = url;
            link.click();
        })
    }

    clear() {
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.w, this.h);
        this.data = [...Array(this.width)].map(e => Array(this.height).fill([0, 0, 0, 255]));
        this.setcolor(this.color);
        this.setmode(this.tool.pen);
        this.publish();
        this.framesManager.updateFrame();
    }

    addImage() {
        var _this = this;
        var fp = document.createElement("input");
        fp.type = "file";
        fp.click();
        fp.onchange = function (e) {
            var reader = new FileReader();
            reader.readAsDataURL(e.target.files[0]);
            reader.onload = function () {
                var uimg = new Image();
                uimg.src = reader.result;
                uimg.width = _this.w;
                uimg.height = _this.h;
                uimg.onload = function () {
                    var pxc = document.createElement("canvas");
                    pxc.width = _this.w;
                    pxc.height = _this.h;
                    var pxctx = pxc.getContext("2d");
                    pxctx.drawImage(uimg, 0, 0, _this.w, _this.h);
                    var i, j;
                    for (i = 0; i < _this.width; i++) {
                        for (j = 0; j < _this.height; j++) {
                            var ctr = 0;
                            var avg = [0, 0, 0, 0];
                            var pix = pxctx.getImageData(10 * i, 10 * j, 10, 10).data;
                            pix.forEach((x, k) => {
                                avg[k % 4] += x;
                                if (k % 4 === 0) ctr++;
                            });
                            avg = avg.map(x => ~~(x / ctr));
                            _this.setcolor(avg);
                            _this.draw(i, j);
                        }
                    }
                }
            }
        }
    }

    perform(clientX, clientY) {
        var rect = this.canvas.getBoundingClientRect();
        var x = clientX - rect.left;
        var y = clientY - rect.top;
        x = Math.floor(this.width * x / this.canvas.clientWidth);
        y = Math.floor(this.height * y / this.canvas.clientHeight);
        if (this.tools[this.tool.pen]) {
            var p = new Point(x, y);
            if (!p.equals(this.previous_point)) {
                this.previous_point = p;
                this.draw(p.x, p.y);
            }
        } else if (this.tools[this.tool.eraser]) {
            this.erase(x, y);
        }
        this.publish();
    }
}