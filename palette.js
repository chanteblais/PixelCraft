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
                highlightSelectedColor(this)
            };
            colorElement.oncontextmenu = function () {
                board.setcolor(color);
                highlightSelectedColor(this);
                board.ctx.globalAlpha = prompt('Transparency(0-1)?');
            };
            palette.append(colorElement);
        })
        document.querySelector("#colorpicker").addEventListener("input", function (event) {
            let hex = event.target.value;
            board.setcolor(hexToRgba(hex));
        }, false);
    }
}