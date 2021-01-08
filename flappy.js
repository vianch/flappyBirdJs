function createBird(source) {
    const initialCoordinates = {
        x: 0,
        y: 200,
    };

    const bird = {
        image: new Image(),
        size: {
            x: 24 * (816 / 374),
            y: 24 * (576 / 374),
        },
        coordinates: {
            x: initialCoordinates.x,
            y: initialCoordinates.y,
        },
        speed:  {
            y: 0,
        },
    };
    bird.image.src = source; 

    return { bird, initialCoordinates }
}

function createPipe(width, height, initialPosition) {
    return {
        coordinates: {
            x: initialPosition,
            y: 0,
        },
        width,
        height,
    };
}

function startFlappy() {
    // Initialize Canvas
    const canvasSize = 400;
    const context = canvas.getContext("2d");
    let isBirdDeath = false;
    let flappyInTime = null;
    let score = 0;

    // BIRD 
    const { bird, initialCoordinates } = createBird("flappy.png");

    // PIPES
    const maxPipeHeight = 200;
    const maxPipeWidth = 30;
    const pipeTop = createPipe(maxPipeWidth, maxPipeHeight, canvasSize);
    const pipeBottom = createPipe(maxPipeWidth, maxPipeHeight, canvasSize);

    // Background
    const backgroundImage = new Image();
    backgroundImage.src = "background.jpg";

    // Flappy framework
    const startEvents = () => {
        canvas.onclick = () => {
            if (!flappyInTime) {
                runGame();
            }

            if (bird.coordinates.y > 0) {
                bird.speed.y = 9
            }

        };
    };
    const resetBackground = () => {
        // draw background
        context.drawImage(
            backgroundImage, 
            0, 
            0,
            400,
            400
        );
    }
    const drawBird = () => {
        context.drawImage(
            bird.image, 
            bird.coordinates.x, 
            bird.coordinates.y,
            bird.size.x, // X
            bird.size.y  // Y 
            );
    };
    const resetBird = () => {
        if(isBirdDeath) {
            bird.speed.y = 0;
            bird.coordinates.y = initialCoordinates.y;
            stopGame();
        }
    };
    const executeGravity = (acceleration) => {
        if (!isBirdDeath) {
            bird.speed.y = bird.speed.y - acceleration;
            bird.coordinates.y = bird.coordinates.y - bird.speed.y;
        }
    };
    const getGapSize = () => Math.floor(bird.size.y) + 100;
    const waitingForCrash = () => {
        const crashedWithTopPipe = Math.floor(pipeTop.coordinates.x) <= Math.floor(bird.size.x)
                                && bird.coordinates.y <= pipeTop.height;
        const crashedWithBottomPipe = Math.floor(pipeBottom.coordinates.x) <= Math.floor(bird.size.x)
                                    && bird.coordinates.y >= getGapSize() + pipeTop.height + Math.floor(bird.size.y);

        if (bird.coordinates.y > canvasSize) {
            isBirdDeath = true;
        } else if (crashedWithTopPipe || crashedWithBottomPipe) {
            isBirdDeath = true;
        } else {
            isBirdDeath = false;
        }
    };
    const drawRandomPipeHeight = () => Math.floor(Math.random() * (maxPipeHeight - bird.size.y + 1)) + bird.size.y;
    const drawPipeTop = () => {
        context.fillStyle = "red";
        context.fillRect(
            pipeTop.coordinates.x, 
            pipeTop.coordinates.y, 
            pipeTop.width,
            pipeTop.height,
        );
    };
    const drawPipeBottom = () => {
        const pipeGapSize = getGapSize();
        const pipePositionY =  pipeGapSize + pipeTop.height;

        context.fillStyle = "blue";
        context.fillRect(
            pipeBottom.coordinates.x, 
            pipePositionY, 
            pipeBottom.width,
            canvasSize - pipePositionY
        );
    };
    const movePipe = (pipe, isTop) => {
        if (pipe.coordinates.x > (0 - pipe.width)) {
            pipe.coordinates.x = pipe.coordinates.x - 8;
        } else  {
            if (isTop) { 
                pipe.height = drawRandomPipeHeight(); 
                score = score + 1
            }
            pipe.coordinates.x = canvasSize;

        }
    };
    const resetPipes = () => {
        if (isBirdDeath) {
            pipeTop.coordinates.x = canvasSize;
            pipeBottom.coordinates.x = canvasSize;
            pipeTop.height = drawRandomPipeHeight();
        }
    };
    const printScore = () => {
        context.fillStyle = "black";
        context.fillText(
            score, 
            10, 
            25,
        );
    };
    const runGame = () => {
        flappyInTime = setInterval(() => {
            // background
            resetBackground();

            // Bird
            drawBird()
            executeGravity(0.5);
            waitingForCrash();
            resetBird();

            // pipes
            drawPipeTop();
            drawPipeBottom();
            movePipe(pipeTop, true);
            movePipe(pipeBottom);
            resetPipes();
    
            // Score
            printScore();
        }, 24);
    };
    const stopGame = () => {
        clearInterval(flappyInTime);
        flappyInTime = null;
        score = 0;
    };

    // Execute flappy actions
    startEvents();
    runGame()
}
    
startFlappy();