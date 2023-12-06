class Line {
    constructor(_x1, _y1, _x2, _y2) {
        this.x1 = _x1;
        this.y1 = _y1;
        this.x2 = _x2;
        this.y2 = _y2;

        window.entities.push(this);
    }

    show() {
        // Draw line
        stroke(0, 255, 0);
        line(this.x1, this.y1, this.x2, this.y2);
    }


}