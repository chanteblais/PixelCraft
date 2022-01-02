class Palette {
    colors = [
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
    ]
    emptySwatchSlots = 5;
    totalSwatches = this.colors.length + this.emptySwatchSlots;
    currentSwatch = this.colors.length;

    populate() {
        let palette = document.querySelector("#palette");
        palette.addEventListener("contextmenu", e => e.preventDefault());
        this.colors.forEach(color => {
            palette.append(this.createColorSwatch(color, false));
        })
        for (let i = 0; i < this.emptySwatchSlots; i++) {
            palette.append(this.createColorSwatch([0, 0, 0, 255], true));
        }
        // Color picker
        document.querySelector("#colorpicker").addEventListener("input", function (event) {
            let hex = event.target.value;
            board.setColor(window.palette.hexToRgba(hex));
        }, false);
        document.querySelector("#colorpicker").addEventListener("change", function (event) {
            let hex = event.target.value;
            let rgba = window.palette.hexToRgba(hex);
            let rgb = `rgb(${rgba[0]}, ${rgba[1]}, ${rgba[2]})`;
            let swatches = palette.children;

            // Check if color is already in the swatches
            for (let swatch of swatches) {
                if (swatch.style.backgroundColor === rgb) {
                    return
                }
            }

            // Update slots
            let swatch = swatches[window.palette.currentSwatch];
            swatch.classList.remove("empty");
            swatch.style.backgroundColor = rgb;
            window.palette.currentSwatch++;
            if (window.palette.currentSwatch === window.palette.totalSwatches) {
                window.palette.currentSwatch = window.palette.colors.length;
            }
        }, false);
    }

    createColorSwatch(color, transparent) {
        let swatch = document.createElement('span');
        swatch.classList.add("item");
        if (transparent) {
            swatch.classList.add("empty");
        } else {
            swatch.style.backgroundColor = `rgb(${color[0]},${color[1]},${color[2]})`;
        }
        swatch.onclick = function () {
            board.setColor(color);
            palette.highlightSelectedColor(this)
        };
        swatch.oncontextmenu = function () {
            board.setColor(color);
            board.ctx.globalAlpha = prompt('Transparency(0-1)?');
            palette.highlightSelectedColor(this);
        };
        return swatch;
    }

    highlightSelectedColor(clr) {
        document.querySelectorAll("#palette .item").forEach(x => x.classList.remove("selected"));
        clr.classList.add("selected")
    }

    hexToRgba(hex) {
        const r = parseInt(hex.substr(1, 2), 16)
        const g = parseInt(hex.substr(3, 2), 16)
        const b = parseInt(hex.substr(5, 2), 16)
        return [r, g, b, 255];
    }
}