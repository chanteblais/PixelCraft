class Frames {
    static load() {
        document.querySelector("#frames #gallery").innerHTML = "";
        for (let frame of board.frames) {
            document.querySelector("#frames #gallery").appendChild(frame[0])
        }
        ;
        document.querySelectorAll("#frames #gallery img").forEach((x, i) => {
            x.onclick = (e) => {
                board.currentFrame = i;
                board.loadFrame(i);
            };
            x.oncontextmenu = (e) => {
                e.preventDefault();
                let del_confirmation = confirm("Delete?");
                if (del_confirmation) {
                    board.deleteFrame(i);
                    Frames.load();
                }
            };
        });
    }

    static close() {
        document.querySelector("#frames").style.transform = "translate(-50%,-50%) scale(0,0)";
    }
}