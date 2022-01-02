class Frames {

    constructor(canvas, data, canvasManager) {
        this.currentFrame = 0;
        this.frames = [];
        this.canvas = canvas;
        this.data = data;
        this.canvasManager = canvasManager;
    }

    load() {
        document.querySelector("#frames #gallery").innerHTML = "";
        for (let frame of this.frames) {
            document.querySelector("#frames #gallery").appendChild(frame[0])
        }
        document.querySelectorAll("#frames #gallery img").forEach((x, i) => {
            x.onclick = (e) => {
                this.currentFrame = i;
                this.canvasManager.populate(this.frames[i][1]);
            };
            x.oncontextmenu = (e) => {
                e.preventDefault();
                let del_confirmation = confirm("Delete?");
                if (del_confirmation) {
                    this.deleteFrame(i);
                    // Frames.load();
                }
            };
        });
    }

    addFrame() {
        const frame = this.getEmptyFrame();
        if (this.frames.length > 0) {
            this.currentFrame++;
        }
        this.frames.splice(this.currentFrame, 0, frame);
        this.canvasManager.populate(this.frames[this.currentFrame][1]);
    }

    getEmptyFrame() {
        if (this.blankFrame) {
            return this.blankFrame
        } else {
            let frame = this.getCanvasImage();
            this.blankFrame = frame;
            return frame
        }
    }

    getCanvasImage() {
        var img = new Image();
        img.src = this.canvas.toDataURL();
        img.draggable = true;
        img.addEventListener('dragstart', this.handleDragStart, false);
        img.addEventListener('dragover', this.handleDragOver, false);
        img.addEventListener('drop', this.handleDrop, false);
        img.addEventListener('dragend', this.handleDragEnd, false);
        return [img, this.data.map(inner => inner.slice())];
    }

    duplicateFrame() {
        const frame = this.getCanvasImage();
        if (this.frames.length > 0) {
            this.currentFrame++;
        }
        this.frames.splice(this.currentFrame, 0, frame);
        this.load();
    }

    updateFrame() {
        this.frames[this.currentFrame] = this.getCanvasImage();
        this.load();
    }

    deleteFrame(f) {
        this.frames.splice(f, 1);
    }



    handleDragStart(e) {
        this.style.opacity = '0.4';
        window.dragSrcEl = this;

        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', this.src);
        return false;
    }

    handleDragOver(e) {
        if (e.preventDefault) {
            e.preventDefault();
        }

        e.dataTransfer.dropEffect = 'move';

        return false;
    }

    handleDrop(e) {
        if (e.preventDefault) {
            e.preventDefault();
        }
        if (window.dragSrcEl !== this) {
            window.dragSrcEl.src = this.src;
            this.src = e.dataTransfer.getData('text/plain');
        }
        return false;
    }

    handleDragEnd(e) {
        this.style.opacity = '1';
    }

    static close() {
        document.querySelector("#frames").style.transform = "translate(-50%,-50%) scale(0,0)";
    }
}