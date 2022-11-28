
function setup() {
    createCanvas(windowWidth, windowHeight + 100);
    angleMode(DEGREES);
}

let eyeX = 800;
const MIRROR_WIDTH = 10;

function draw() {
    background(255);
    const leftLineX = 710;
    const rightLineX = 900;
    const mirrorXDistance = rightLineX - leftLineX;
    const mirrorStartY = 20;
    const mirrorHeight = 500;
    const mirrorEndY = mirrorStartY + mirrorHeight

    const objX = 800;
    const objY = mirrorHeight - 10
    const eyeY = mirrorHeight + 50;

    let theta = 90 + atan((objX - eyeX) / (objY - eyeY));

    const colisionLineX = eyeX < objX ? rightLineX : leftLineX;
    const reflectLineXDist = colisionLineX - objX;
    const reflectLineYDist = reflectLineXDist * tan(theta);
    const startX = colisionLineX;
    const startY = objY - reflectLineYDist;

    drawMirrors(leftLineX - MIRROR_WIDTH, rightLineX, mirrorStartY, mirrorHeight);
    drawObject(objX, objY);
    drawEye(eyeX, eyeY);
    line(eyeX, eyeY, objX, objY);
    if (startY > mirrorEndY) {
        return;
    }

    // a collision will happen
    line(objX, objY, startX, startY);
    fill(0);
    textSize(20);

    text("θ = " + Math.round(theta), windowWidth - 200, 50);
    fill(235);

    let count = 0;
    function drawIntersection(startX, startY, theta, isRight) {
        const thetaPrime = 180 - theta;
        const newCLineX = isRight ? leftLineX : rightLineX;
        const newYDistance = (!isRight ? -1 : 1) * (rightLineX - leftLineX) * tan(thetaPrime)
        const newCLineY = startY + newYDistance;
        line(startX, startY, newCLineX, newCLineY);
        let newObjX;
        const distance = count * mirrorXDistance + Math.abs(colisionLineX - objX);
        if (isRight) {
            newObjX = distance + rightLineX;
        } else {
            newObjX = leftLineX - distance;
        }
        if (count > 0) {
            drawMirrors(leftLineX - count*mirrorXDistance, rightLineX + count*mirrorXDistance, mirrorStartY, mirrorHeight);
        }
        drawObject(newObjX, objY);
        setLineDash([5, 5]);
        line(startX, startY, newObjX, objY);
        setLineDash([]);
        if (newCLineY < mirrorStartY) {
            return;
        }
        count += 1;
        drawIntersection(newCLineX, newCLineY, thetaPrime, !isRight);
    }


    if (reflectLineYDist < mirrorEndY) {
        const isRight = eyeX < objX;
        drawIntersection(startX, startY, theta, isRight);
    } else {
        text('no-collision', 100, 200);
    }
}


function drawMirrors(leftLineX, rightLineX, mirrorStartY, mirrorHeight) {
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
    if (keyCode === LEFT_ARROW) {
        eyeX -= 15;
        draw();
    } else if (keyCode === RIGHT_ARROW) {
        eyeX += 15
        draw();
    }
}