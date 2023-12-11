class Line {
    constructor(_x1, _y1, _x2, _y2) {
        this.x1 = _x1;
        this.y1 = _y1;
        this.x2 = _x2;
        this.y2 = _y2;
    }

    show() {
        // Draw line
        push()
        stroke(0, 255, 0);
        strokeWeight(1);
        line(this.x1, this.y1, this.x2, this.y2);
        console.log("drawing line, x1 : ", this.x1 + " y1 :", this.y1, " x2 : ", this.x2, " y2 ", this.y2);
        strokeWeight(1);
        pop()
    }


}