
function setup() {
    createCanvas(windowWidth, windowHeight);
    angleMode(DEGREES);
}

let eyex = 500;

function draw() {
    background(255);
    const leftLineX = 200;
    const rightLineX = 800;
    const mirrorStartY = 20;
    const mirrorHeight = 500;
    const mirrorEndY = mirrorStartY + mirrorHeight

    const objx = 400;
    const objy = mirrorHeight - 100
    const eyey = mirrorHeight + 200;

    let theta = 90 + atan((objx - eyex) / (objy - eyey));

    const colisionLineX = eyex < objx ? rightLineX : leftLineX;
    const reflectLineXDist = colisionLineX - objx;
    const reflectLineYDist = reflectLineXDist * tan(theta);
    const startX = colisionLineX;
    const startY = objy - reflectLineYDist;

    drawMirrors(leftLineX, rightLineX, mirrorStartY, mirrorHeight);
    drawObject(objx, objy);
    drawEye(eyex, eyey);
    line(eyex, eyey, objx, objy);
    if (startY > mirrorEndY) {
        return;
    }
    
    // a collision will happen
    line(objx, objy, startX, startY);
    text(theta, 50, 50);
    let count = 1;
    function drawIntersection(startX, startY, theta, isRight) {
        const thetaPrime = 180 - theta;
        calculateNumImages(theta);
        const newCLineX = isRight ? leftLineX : rightLineX;
        const newYDistance = (!isRight ? -1 : 1) * (rightLineX - leftLineX) * tan(thetaPrime)
        const newCLineY = startY + newYDistance;
        line(startX, startY, newCLineX, newCLineY);
        count += 1;
        let newObjX;
        const distance = count * Math.abs(colisionLineX - objx);
        if (isRight) {
            newObjX = distance + rightLineX;
        } else {
            newObjX = leftLineX - distance;
        }
        drawObject(newObjX, objy);
        if (newCLineY > mirrorStartY) {
            drawIntersection(newCLineX, newCLineY, thetaPrime, !isRight);
        }
    }


    if (reflectLineYDist < mirrorEndY) {
        const isRight = eyex < objx;

        let newObjX;
        if (isRight) {
            newObjX = Math.abs(colisionLineX - objx) + rightLineX;
        } else {
            newObjX = leftLineX - Math.abs(colisionLineX - objx);
        }
        drawObject(newObjX, objy);
        drawIntersection(startX, startY, theta, isRight);
    } else {
        text('no-collision', 100, 200);
    }
}

function calculateNumImages(theta) {
    const numImages = (Math.round(360 / theta) - 1);
    text(numImages, 50, 200);
}

function drawMirrors(leftLineX, rightLineX, mirrorStartY, mirrorHeight) {
    fill(200);
    rect(leftLineX, mirrorStartY, 10, mirrorHeight);
    rect(rightLineX, mirrorStartY, 10, mirrorHeight);
}

function drawObject(x, y) {
    fill('orange');
    ellipse(x, y, 20, 20)
    fill(200);
}

function drawEye(x, y) {
    fill('blue');
    ellipse(x, y, 20, 10)
    fill(200);
}

function keyPressed() {
    debugger;
    if (keyCode === LEFT_ARROW) {
        eyex -= 50;
        draw();
    } else if (keyCode === RIGHT_ARROW) {
        eyex += 50
        draw();
    }
}