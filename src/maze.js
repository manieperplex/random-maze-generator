import Cell from './cell'

export default class Maze {
    constructor(cols = 20, rows = 20, delay = 10) {
        this.cols = cols
        this.rows = rows
        this.pathWidth = 10
        this.wallWidth = 2
        this.outerWallWidth = this.wallWidth
        this.pathColor = '#222a33'
        this.wallColor = '#d24'
        this.delay = delay
        this.grid = this.initGrid()
        this.draw()
    }

    get data() {
        return this.grid
    }

    initGrid = () => {
        // init with outerwalls
        let grid = []
        for (let y=0; y < this.rows; y++) {
            grid[y] = []
            for (let x=0; x < this.cols; x++) {
                let up, left, down, right
                y == 0 ? up = false : up = true
                x == 0 ? left = false : left = true
                y+1 == this.rows ? down = false : down = true
                x+1 == this.cols ? right = false : right = true

                grid[y][x] = new Cell(up, left, right, down)
            }
        }
        return grid
    }

    getNeighbours = (y, x) => {
        const current = this.grid[y][x]
        let options = []        

        if (current.up == true && this.grid[y-1][x].visited == false) {
            options.push([y-1, x])
        }
        if (current.left == true && this.grid[y][x-1].visited == false) {
            options.push([y, x-1])          
        }
        if (current.down == true && this.grid[y+1][x].visited == false) {
            options.push([y+1, x])     
        }
        if (current.right == true && this.grid[y][x+1].visited == false) {
            options.push([y, x+1])       
        }

        return options        
    }

    getRandomItemFromArray = (array) => {
        let count = array.length, randomnumber, temp
        while(count) {
            randomnumber = Math.random() * count-- | 0
            temp = array[count]
            array[count] = array[randomnumber]
            array[randomnumber] = temp
        }

        return array[this.getRandomIntegerFromInterval(0, array.length -1)]
    }

    getRandomIntegerFromInterval = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    draw = async() => {
        // Draw random maze with Depth-first search recursive backtracker algorythm
        // https://en.wikipedia.org/wiki/Maze_generation_algorithm
        const canvas = document.getElementById('maze')
        canvas.width = this.outerWallWidth * 2 + this.cols*(this.pathWidth + this.wallWidth) - this.wallWidth
        canvas.height = this.outerWallWidth * 2 + this.rows*(this.pathWidth + this.wallWidth) - this.wallWidth

        const ctx = canvas.getContext('2d')
        ctx.strokeStyle = this.pathColor
        ctx.fillStyle = this.wallColor
        ctx.lineWidth = this.pathWidth
        ctx.lineCap = 'square'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.beginPath()

        const offset = this.pathWidth / 2 + this.outerWallWidth
        const totalCells = this.rows * this.cols
        let stack = []
        let cellsVistited = 0
        let y = this.getRandomIntegerFromInterval(0, this.rows -1)
        let x = this.getRandomIntegerFromInterval(0, this.cols -1)

        this.grid[y][x].visited = true
        cellsVistited++

        while(cellsVistited < totalCells) {
            ctx.moveTo(
                x*(this.pathWidth + this.wallWidth) + offset,
                y*(this.pathWidth + this.wallWidth) + offset
            )

            const neighbours = this.getNeighbours(y, x)
            if (neighbours.length > 0) {
                const next = this.getRandomItemFromArray(neighbours)
                stack.push(next)

                y = next[0]
                x = next[1]

                ctx.lineTo(
                    x*(this.pathWidth + this.wallWidth) + offset,
                    y*(this.pathWidth + this.wallWidth) + offset
                )            
                ctx.stroke()

                this.grid[y][x].visited = true
                cellsVistited++
            }
            else if(stack.length > 0) {
                const lastVisited = stack.pop()
                y = lastVisited[0]
                x = lastVisited[1]
            }

            if (this.delay > 0) {
                await this.sleep(this.delay)
            }            
        }
    }
}