import * as Entities from "./entities.js"
import { Ray, Vector } from "./utils.js"

export interface Scene{
    size:Vector;
    entities:Entities.Entities[];
    robot: Entities.Robot;
    time:number;
    timestamps:Array<Entities.Timestamp>;

    intersectWithWalls(ray:Ray) : Vector | undefined;
}

export class BaseScene{
    size:Vector;
    entities:Entities.Entities[] = [];
    robot: Entities.Robot;
    time:number = 0;
    timestamps:Array<Entities.Timestamp> = [];

    constructor(size:Vector = new Vector(10000,10000)){
        this.size = size;
        this.robot = new Entities.Robot(this.size.scale(0.5), new Vector(250,250), 0, 30, this)
        this.entities.push(new Entities.Wall(Vector.null(), this.size.projX()));
        this.entities.push(new Entities.Wall(Vector.null(), this.size.projY()));
        this.entities.push(new Entities.Wall(this.size,     this.size.projY()));
        this.entities.push(new Entities.Wall(this.size,     this.size.projX()));
        this.timestamps.push(new Entities.Timestamp(0, this.robot));
    }

    intersectWithWalls(ray: Ray): Vector | undefined {
        for (let entity of this.entities) {
            if (entity.type === "Wall") {
                const poi: Vector[] = entity.intersect(ray);
                if (poi.length != 0) {
                    return poi[0];
                }
            }
        }
        return undefined;
    }
}

// You can add new Scenes here