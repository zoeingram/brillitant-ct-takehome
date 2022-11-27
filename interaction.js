
function setup() {
    createCanvas(windowWidth, windowHeight);
    angleMode(DEGREES);
}

let eyex = 500;

function draw() {
    background(255);
    const leftLineX = 700;
    const rightLineX = 900;
    const mirrorXDistance = rightLineX - leftLineX;
    const mirrorStartY = 20;
    const mirrorHeight = 500;
    const mirrorEndY = mirrorStartY + mirrorHeight

    const objx = 800;
    const objy = mirrorHeight - 10
    const eyey = mirrorHeight + 50;

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
    let count = 0;
    function drawIntersection(startX, startY, theta, isRight) {
        const thetaPrime = 180 - theta;
        calculateNumImages(theta);
        const newCLineX = isRight ? leftLineX : rightLineX;
        const newYDistance = (!isRight ? -1 : 1) * (rightLineX - leftLineX) * tan(thetaPrime)
        const newCLineY = startY + newYDistance;
        line(startX, startY, newCLineX, newCLineY);
        let newObjX;
        const distance = count * mirrorXDistance + Math.abs(colisionLineX - objx);
        if (isRight) {
            newObjX = distance + rightLineX;
        } else {
            newObjX = leftLineX - distance;
        }
        drawMirrors(leftLineX - count*mirrorXDistance, rightLineX + count*mirrorXDistance, mirrorStartY, mirrorHeight, 245);
        drawObject(newObjX, objy);
        setLineDash([5, 5]);
        line(startX, startY, newObjX, objy);
        setLineDash([]);
        if (newCLineY < mirrorStartY) {
            return;
        }
        count += 1;
        drawIntersection(newCLineX, newCLineY, thetaPrime, !isRight);
    }


    if (reflectLineYDist < mirrorEndY) {
        const isRight = eyex < objx;
        drawIntersection(startX, startY, theta, isRight);
    } else {
        text('no-collision', 100, 200);
    }
}

function calculateNumImages(theta) {
    const numImages = (Math.round(360 / theta) - 1);
    text(numImages, 50, 200);
}

function drawMirrors(leftLineX, rightLineX, mirrorStartY, mirrorHeight, f = 200) {
    fill(f);
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

function setLineDash(list) {
    drawingContext.setLineDash(list);
}

function keyPressed() {
    debugger;
    if (keyCode === LEFT_ARROW) {
        eyex -= 15;
        draw();
    } else if (keyCode === RIGHT_ARROW) {
        eyex += 15
        draw();
    }
}