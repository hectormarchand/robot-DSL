class Robot {
    constructor(factor, _x = 0, _y = 0, _width = 50, _height = 75, _angle = 0) {
        this.factor = factor;
        // x and y represent the center of the robot
        this.x = _x;
        this.y = _y;
        this.angle = _angle;
        this.width = _width;
        this.height = _height;
    }
  
    show() {
        push();
        const canvasX = this.x * this.factor;
        const canvasY = this.y * this.factor;
        translate(canvasX, canvasY);
        rotate(this.angle);
        stroke(255, 255, 255);
        rect(-this.height/2, -this.width/2, this.height, this.width);
        stroke(255, 0, 0);
        fill(255, 0, 0);
        const h = (Math.sqrt(3)/2) * (this.width/3)
        triangle(-0.5*h, -(this.height/6), -0.5*h, this.height/6, 0.5*h, 0);
        pop();
    }
  
    turn(angle){
        console.log("turning ", angle);
        this.angle += angle;
        if(this.angle<0){
            this.angle += 2 * Math.PI;
        } else if (this.angle >= 2 * Math.PI){
            this.angle -= 2 * Math.PI;
        }
    }

    move(dist){
        console.log("moving", dist);
        let anglecos = cos(this.angle);
        let anglesin = sin(this.angle);
        const previous_x = this.x;
        const previous_y = this.y;
        this.x += anglecos*dist;
        this.y += anglesin*dist;

        // Add a line only if the robot has moved
        if (previous_x != this.x || previous_y != this.y) {
            window.entities.push(new Line(previous_x, previous_y, this.x, this.y));
        }
        
    }

    side(dist){
        let anglecos = cos(this.angle);
        let anglesin = sin(this.angle);
        this.x += -anglesin*dist;
        this.y += anglecos*dist;
    }
  }