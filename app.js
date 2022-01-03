class App {

    createProject(width, height) {
        if (window.board === undefined) {
            this.canvas = new Canvas(width, height);
            window.board = this.canvas;
            window.palette = new Palette();
            window.palette.populate()
        }
    }

    async publishGIF() {
        let payload = []
        let i, j;
        this.canvas.framesManager.frames.forEach(frame => {
            let img = frame[1]
            let gifFrame = []
            for (i = 0; i < this.canvas.width; i++) {
                for (j = 0; j < this.canvas.height; j++) {
                    var hex_value = ColourUtils.rgbToHex(img[j][i][0], img[j][i][1], img[j][i][2])
                    gifFrame.push(hex_value)
                }
            }
            payload.push(gifFrame)
        });
        await fetch('http://localhost:3000/publish', {
            headers: {"Content-Type": "application/json"},
            method: 'POST',
            body: JSON.stringify({gif: true, payload})
        })
    }
}

window.onload = function () {
    window.app = new App();
    window.app.createProject(16, 16);
}