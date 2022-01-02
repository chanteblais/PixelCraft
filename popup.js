class Popup {
    constructor(s) {
        this.s = s;
        document.querySelector(this.s).style.display = "block";
        document.querySelector(this.s).style.transform = "translate(-50%,-50%) scale(1,1)";
    }

    close() {
        document.querySelector(this.s).style.transform = "translate(-50%,-50%) scale(0,0)";
    }
}