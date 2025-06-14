import Game from './Game.js'

let game1 = new Game()
game1.start()
game1.setPiece(2,0,'King', 'white')
console.log(game1.getMoves(2,0))

// let a = [1,2]
// let b = [2,3]
// let c = a+b
// console.log(c)