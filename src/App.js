import React from 'react'
import {useState, useEffect, useRef} from 'react'
import {useInterval} from './useInterval'
import {
    CANVAS_SIZE,
    SNAKE_START,
    APPLE_START,
    SCALE,
    SPEED,
    DIRECTIONS,
} from './constants'

const App = () => {

    const canvasRef = useRef();
    const [snake,setSnake] = useState(SNAKE_START);
    const [apple,setApple] = useState(APPLE_START);
    const [dir,setDir] = useState([0,-1]);
    const [speed,setSpeed] = useState(null);
    const [gameOver,setGameover] = useState(false);

    const startGame = () => {
        setSnake(SNAKE_START);
        setApple(APPLE_START);
        setDir([0,-1]);
        setSpeed(SPEED);
        setGameover(false);
    }
    const endGame = () => {
        setSpeed(null);
        setGameover(true);
    }

    const moveSnake = ({keyCode}) => {
        if(keyCode=>37 && keyCode<=40){ 
            setDir(DIRECTIONS[keyCode])} else {
            };
       
    }

    const createApple = () => {
        const newApple = [];
        newApple.push(Math.floor(Math.random() * (CANVAS_SIZE[0] /SCALE)));
        newApple.push(Math.floor(Math.random() * (CANVAS_SIZE[1] /SCALE)));
        return newApple;
    }

    const checkCollision =(piece,snk = snake) => { //default value of nake
            if(
                piece[0]* SCALE >= CANVAS_SIZE[0] ||
                piece[0] < 0 ||
                piece[1] * SCALE >= CANVAS_SIZE[1] ||
                piece[1] < 0 
            ){
                return true;
            }
            for(const segment of snk){                                          //check snake collides with itself
                if(piece[0] === segment[0] && piece[1] === segment[1]){
                    return true;
                }
            }
            return false;

    }

    const checkAppleCollision = (newSnake) => {                   //apple eating
        if(newSnake[0][0] === apple[0] && newSnake[0][1] === apple[1]){
            let newApple = createApple();
            while (checkCollision(newApple, newSnake)){
                newApple = createApple();
            }
            setApple(newApple);
            return true;
        }
        return false;
    }
    const gameLoop = () => {
        const snakeCopy =JSON.parse(JSON.stringify(snake));
        const newSnakehead = [snakeCopy[0][0] + dir[0],snakeCopy[0][1] + dir[1]]; //update new snake head direction
        snakeCopy.unshift(newSnakehead);              // add new snake head 
        if(checkCollision(newSnakehead)){ endGame()}   //check if snake head hits wall
        if(!checkAppleCollision(snakeCopy)) snakeCopy.pop();
        setSnake(snakeCopy);
    }

    useEffect(()=> {
        const context = canvasRef.current.getContext("2d");
        context.setTransform(SCALE,0,0,SCALE,0,0);                 //transform the rectangle setTranform(horizontal scale,horixonatl skewing,vertical skewing, vertical scale,horizontal move, vertical move)
        context.clearRect(0,0,CANVAS_SIZE[0],CANVAS_SIZE[1]);       // clear the canvas and draw new snake and apple positions
        context.fillStyle ="pink" ;                                  //for snake
        snake.forEach(([x,y])=> context.fillRect(x,y,1,1))  ;        //x,y are the postions of the snake ,scale 1 initially but later scaled up by scale
        context.fillStyle = "lightblue";
        context.fillRect(apple[0],apple[1],1,1);
    },[snake,apple,gameOver])

    useInterval(()=> gameLoop(),speed);

    return (
    <div class="outer" role="button" tabIndex="0" onKeyDown={e => moveSnake(e)}>
        <canvas
        style={{border: "1px solid black", background: "black"}}
        ref={canvasRef}
        width = {`${CANVAS_SIZE[0]}px`} 
        height = {`${CANVAS_SIZE[1]}px`}/>
        {gameOver && <div>GAME OVER!</div>}
        <button class="start" onClick={startGame}>Start Game</button>
    </div>
       
    );
}

export default App
