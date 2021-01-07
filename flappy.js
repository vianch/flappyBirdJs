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

function createPipe() {
    return {
        coordinates: {
            x: 200,
            y: 0,
        },
        width: 24,
        height: 200,
    };
}

function startFlappy() {
    // BIRD 
    const { bird, initialCoordinates } = createBird("flappy.png");

    // PIPES
    const pipe = createPipe();

    // Initialize Canvas
    const canvasSize = 400;
    const context = canvas.getContext("2d");
    let isBirdDeath = false;
    
    // Flappy framework
    const setEvents = () => {
        canvas.onclick = () => {
            if (bird.coordinates.y > 0) {
                bird.speed.y = 9
            }
        };
    };
    const resetBackground = () => {
        // draw background
        context.fillStyle = "skyblue";
        context.fillRect(0,0, canvasSize, canvasSize);
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
        isBirdDeath = bird.coordinates.y > canvasSize;

        if(isBirdDeath) {
            bird.speed.y = 0;
            bird.coordinates.y = initialCoordinates.y;
        }
    };
    const executeGravity = (acceleration) => {
        if (!isBirdDeath) {
            bird.speed.y = bird.speed.y - acceleration;
            bird.coordinates.y = bird.coordinates.y - bird.speed.y;
        }
    };
    const drawPipe = () => {
        context.fillStyle = "green";
        context.fillRect(
            pipe.coordinates.x, 
            pipe.coordinates.y, 
            pipe.width,
            pipe.height,
        );
    };
    const movePipe = () => {
        if (pipe.coordinates.x > (0 - pipe.width)) {
            pipe.coordinates.x = pipe.coordinates.x - 8;
        } else {
            pipe.coordinates.x = canvasSize;
        }
    };

    const runGame = () => {
        setEvents();

        setInterval(() => {
            // background
            resetBackground();

            // Bird
            drawBird()
            executeGravity(0.5);
            resetBird();

            // pipes
            drawPipe();
            movePipe();
        }, 24);
    };



    // Execute flappy actions
    runGame();
}
    
startFlappy();