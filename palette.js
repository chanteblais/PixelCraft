class Palette {
    static populate() {
        let palette = document.querySelector("#palette");
        palette.addEventListener("contextmenu", e => e.preventDefault());
        colors.forEach(color => {
            let colorElement = document.createElement('span');
            colorElement.classList.add("item");
            colorElement.style.backgroundColor = `rgb(${color[0]},${color[1]},${color[2]})`;
            colorElement.onclick = function () {
                board.setcolor(color);
                Palette.highlightSelectedColor(this)
            };
            colorElement.oncontextmenu = function () {
                board.setcolor(color);
                Palette.highlightSelectedColor(this);
                board.ctx.globalAlpha = prompt('Transparency(0-1)?');
            };
            palette.append(colorElement);
        })
        document.querySelector("#colorpicker").addEventListener("input", function (event) {
            let hex = event.target.value;
            board.setcolor(Palette.hexToRgba(hex));
        }, false);
    }

    static highlightSelectedColor(clr) {
        document.querySelectorAll("#palette .item").forEach(x => x.style.boxShadow = "");
        clr.style.boxShadow = "10px 10px 10px 10px rgba(0,0,0,0.5)";
    }

    static hexToRgba(hex) {
        const r = parseInt(hex.substr(1, 2), 16)
        const g = parseInt(hex.substr(3, 2), 16)
        const b = parseInt(hex.substr(5, 2), 16)
        return [r, g, b, 1];
    }
}