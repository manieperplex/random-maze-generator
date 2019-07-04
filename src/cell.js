export default class Cell {
    constructor(up=false, left=false, right=false, down=false) {
        this.up = up
        this.left = left
        this.right = right
        this.down = down
        this.visited = false
    }

    set visit(visited) {
        this.visited = visited
    }
}