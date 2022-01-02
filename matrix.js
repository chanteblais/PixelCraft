class Matrix {

    createProject(width, height) {
        if (window.board === undefined) {
            window.board = new Canvas(width, height);
        }
    }

    async publishGIF() {
        let payload = []
        let i, j;
        window.board.framesManager.frames.forEach(frame => {
            var img = frame[1]
            var gifFrame = []
            for (i = 0; i < this.width; i++) {
                for (j = 0; j < this.height; j++) {
                    var hex_value = this.rgbToHex(img[j][i][0], img[j][i][1], img[j][i][2])
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
    let matrix = new Matrix();
    matrix.createProject(16, 16);
    window.palette = new Palette();
    window.palette.populate()
}