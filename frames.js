class Frames {

    constructor(canvasManager) {
        this.frames = [];
        this.canvasManager = canvasManager;
        this.trash = document.querySelector("#trash");
        this.trash.addEventListener("drop", this.handleTrashDrop, false);
        this.trash.addEventListener("dragover", this.handleDragOver, false);
        this.trash.addEventListener("dragleave", this.handleDragLeave, false);
        this.trash.addEventListener("dragend", this.handleDragEnd, false);
    }

    load() {
        const gallery = document.querySelector("#frames #gallery");
        gallery.innerHTML = "";
        for (let i = 0; i < this.frames.length; i++) {
            let frame = this.frames[i];
            let imgElement = frame[0];
            imgElement.onclick = (e) => {
                this.setCurrentFrame(e.target);
                this.canvasManager.populate(this.frames[i][1]);
            };
            imgElement.ontouchstart = (e) => {
                this.setCurrentFrame(e.target);
                this.canvasManager.populate(this.frames[i][1]);
            };
            imgElement.oncontextmenu = (e) => {
                e.preventDefault();
                let del_confirmation = confirm("Delete?");
                if (del_confirmation) {
                    this.deleteFrame(i);
                }
            };
            gallery.appendChild(imgElement);
        }
        this.ensureCurrentFrameIsVisible();
    }

    loadFrame(f) {
        this.canvasManager.populate(this.frames[f][1]);
    }

    setCurrentFrame(img) {
        let galleryItems = document.querySelectorAll("#frames #gallery img");
        for (let i = 0; i < galleryItems.length; i++) {
            let current = galleryItems[i] === img;
            galleryItems[i].setAttribute("current", current.toString());
            let frameImg = this.frames[i][0];
            if (current) {
                this.canvasManager.populate(this.frames[i][1]);
                this.addBorder(frameImg);
            } else {
                this.removeBorder(frameImg);
            }
        }
    }

    ensureCurrentFrameIsVisible() {
        document.querySelectorAll("#frames #gallery img").forEach(img => {
            if (img.getAttribute("current") === "true") {
                img.scrollIntoView();
            }
        });
    }

    addBorder(img) {
        img.style.borderStyle = "solid";
        img.style.borderColor = "red";
    }

    removeBorder(img) {
        img.style.borderStyle = null;
        img.style.borderColor = null;
    }

    getCurrentFrameIndex() {
        let frames = document.querySelectorAll(("#frames #gallery img"));
        for (let i = 0; i < frames.length; i++) {
            if (frames[i].getAttribute("current") === "true") {
                return i;
            }
        }
        return 0;
    }

    addFrame() {
        const frame = this.getEmptyFrame();
        let currentFrameIndex = this.getCurrentFrameIndex();
        if (this.frames.length !== 0) {
            currentFrameIndex += 1;
        }
        this.frames.splice(currentFrameIndex, 0, frame);
        this.load();
        this.setCurrentFrame(frame[0]);
        // this.canvasManager.populate(frame[1]);
    }

    getEmptyFrame() {
        let img = this.createThumbnail();
        img.src = this.canvasManager.emptySrc;
        return [img, [...Array(this.canvasManager.width)].map(e => Array(this.canvasManager.height).fill([0, 0, 0, 255]))];
    }

    getCanvasImage() {
        let img = this.createThumbnail();
        img.src = this.canvasManager.canvas.toDataURL();
        return [img, this.canvasManager.data.map(inner => inner.slice())];
    }

    createThumbnail() {
        let img = new Image();
        img.draggable = true;
        img.addEventListener("dragstart", this.handleDragStart, false);
        img.addEventListener("dragover", this.handleDragOver, false);
        img.addEventListener("drop", this.handleDrop, false);
        img.addEventListener("dragend", this.handleDragEnd, false);
        return img;
    }

    duplicateFrame() {
        const frame = this.getCanvasImage();
        this.frames.splice(this.getCurrentFrameIndex(), 0, frame);
        this.load();
    }

    updateFrame() {
        let updatedImage = this.getCanvasImage();
        this.frames[this.getCurrentFrameIndex()][0].src = updatedImage[0].src;
        this.frames[this.getCurrentFrameIndex()][1] = updatedImage[1];
        this.load();
    }

    deleteFrame(f) {
        this.frames.splice(f, 1);
    }

    handleDragStart(e) {
        this.style.opacity = "0.4";
        document.querySelector("#canvas").style.opacity = "0.4";
        board.framesManager.trash.style.visibility = "visible";
        window.dragSrcEl = this;

        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", this.src);
        return false;
    }

    handleDragOver(e) {
        if (e.preventDefault) {
            e.preventDefault();
        }

        let trash = document.querySelector("#trash");
        if (this === trash) {
            let icon = document.querySelector("#trash > span > i");
            icon.classList.remove("fa-trash");
            icon.classList.add("fa-trash-restore");
        }
        e.dataTransfer.dropEffect = "move";

        return false;
    }

    handleDragLeave(e) {
        if (e.preventDefault) {
            e.preventDefault();
        }
        let icon = document.querySelector("#trash > span > i");
        icon.classList.add("fa-trash");
        icon.classList.remove("fa-trash-restore");
    }

    handleDrop(e) {
        if (e.preventDefault) {
            e.preventDefault();
        }

        let galleryItems = document.querySelectorAll("#frames #gallery img");
        let draggedIndex;
        let draggedItem;
        let droppedIndex;
        for (let i = 0; i < galleryItems.length; i++) {
            if (this === galleryItems[i]) {
                droppedIndex = i;
            }
            if (window.dragSrcEl === galleryItems[i]) {
                draggedIndex = i;
                draggedItem = board.framesManager.frames[i];
            }
            if (droppedIndex && draggedIndex) {
                break;
            }
        }

        board.framesManager.frames.splice(draggedIndex, 1);
        board.framesManager.frames.splice(droppedIndex, 0, draggedItem);
        board.framesManager.load();

        return false;
    }

    handleTrashDrop(e) {
        if (e.preventDefault) {
            e.preventDefault();
        }

        let framesLength = board.framesManager.frames.length;
        if (framesLength === 1) {
            board.clear();
            return false;
        }
        let currentFrameIndex = board.framesManager.getCurrentFrameIndex();
        for (let i = 0; i < board.framesManager.frames.length; i++) {
            const frame = board.framesManager.frames[i];
            if (window.dragSrcEl === frame[0]) {
                if (currentFrameIndex === i) {
                    let index;
                    if (currentFrameIndex === 0) {
                        index = i + 1;
                    } else {
                        index = i - 1;
                    }
                    board.framesManager.setCurrentFrame(board.framesManager.frames[index][0]);
                }
                board.framesManager.deleteFrame(i);
                break;
            }
        }
        board.framesManager.load();
    }

    handleDragEnd(e) {
        this.style.opacity = "1";
        document.querySelector("#canvas").style.opacity = "1";
        document.querySelector("#trash").style.visibility = "hidden";
        let trashIcon = document.querySelector("#trash").childNodes[1];
        trashIcon.innerHTML = "";
        trashIcon.innerHTML = "<i class=\"fas fa-trash\"></i>";
    }

    static close() {
        document.querySelector("#frames").style.transform = "translate(-50%,-50%) scale(0,0)";
    }
}
