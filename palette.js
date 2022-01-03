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
        let colorPicker = document.querySelector("#colorpicker");
        colorPicker.addEventListener("input", function (event) {
            let hex = event.target.value;
            board.setColor(ColourUtils.hexToRgba(hex));
        }, false);

        colorPicker.addEventListener("blur", function (event) {
            window.palette.saveSelectedColor(event, palette);
        }, false);
    }

    saveSelectedColor(event, palette) {
        let hex = event.target.value;
        let rgba = ColourUtils.hexToRgba(hex);
        let rgb = ColourUtils.getCSSColourFromRGBArray(rgba);
        let swatches = palette.children;

        // Check if color is already in the swatches
        for (let swatch of swatches) {
            if (swatch.style.backgroundColor === rgb) {
                return
            }
        }

        // Update slots
        palette.replaceChild(this.createColorSwatch(rgba, false), swatches[window.palette.currentSwatch]);
        window.palette.currentSwatch++;
        if (window.palette.currentSwatch === window.palette.totalSwatches) {
            window.palette.currentSwatch = window.palette.colors.length;
        }

        // Updates color (so the swatch gets highlighted)
        board.setColor(ColourUtils.hexToRgba(hex))
    }

    createColorSwatch(color, emptySlot) {
        let swatch = document.createElement('span');
        swatch.classList.add("item");
        if (emptySlot) {
            swatch.classList.add("empty");
        } else {
            swatch.style.backgroundColor = ColourUtils.getCSSColourFromRGBArray(color);
            swatch.onclick = function () {
                board.setColor(color);
            };
            swatch.oncontextmenu = function () {
                board.setColor(color);
                board.ctx.globalAlpha = prompt('Transparency(0-1)?');
            };
        }
        return swatch;
    }

    highlightSelectedColor(colorArray) {
        document.querySelectorAll("#palette .item")
            .forEach(swatch => {
                let swatchColour = ColourUtils.getRGBArrayFromCSSColour(swatch.style.backgroundColor);
                if (swatchColour) {
                    if (swatchColour.toString() !== colorArray.toString()) {
                        swatch.classList.remove("selected")
                    } else {
                        swatch.classList.add("selected")
                    }
                }
            });
    }
}