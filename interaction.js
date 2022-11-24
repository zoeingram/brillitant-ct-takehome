
function setup() {
    createCanvas(1200, 1200);
    angleMode(DEGREES);
}

function draw() {
    background(220);
    // noFill()
    const leftLineX = 200;
    const rightLineX = 800;
    const mirrorStartY = 20;
    const mirrorHeight = 500;
    const mirrorEndY = mirrorStartY + mirrorHeight

    const objx = 300;
    const objy = mirrorHeight - 50
    const eyex = 520;
    const eyey = mirrorHeight + 50;

    let theta = 90 + atan((objx - eyex) / (objy - eyey));

    const colisionLineX = eyex < objx ? rightLineX : leftLineX;
    const reflectLineXDist = colisionLineX - objx;
    const reflectLineYDist = reflectLineXDist * tan(theta);

    drawMirrors(leftLineX, rightLineX, mirrorStartY, mirrorHeight);
    drawObject(objx, objy);
    drawEye(eyex, eyey);
    line(eyex, eyey, objx, objy);
    line(objx, objy, colisionLineX, objy - reflectLineYDist);
    text(theta, 50, 50);

    const startX = colisionLineX;
    const startY = objy - reflectLineYDist;

    function drawIntersection(startX, startY, theta, isLeft) {
        const thetaPrime = 180-theta;
        calculateNumImages(theta);


        // text(thetaPrime, 50, 100);
        const newCLineX = isLeft ? leftLineX : rightLineX;
        const newYDistance = (!isLeft ? -1 : 1) * (rightLineX-leftLineX) * tan(thetaPrime)
        const newCLineY = startY + newYDistance;
        line(startX, startY, newCLineX, newCLineY);
        if (newCLineY < mirrorEndY) {
            drawIntersection(newCLineX, newCLineY, thetaPrime, !isLeft);
        }
    }


    if (reflectLineYDist < mirrorEndY) {
        drawIntersection(startX, startY, theta, eyex < objx);
    } else {
        text('no-collision', 100, 200);
    }
}

function calculateNumImages(theta) {
    const numImages = (Math.round(360/theta) -1);
    text(numImages, 50, 200);
}

function drawMirrors(leftLineX, rightLineX, mirrorStartY, mirrorHeight) {
    rect(leftLineX, mirrorStartY, 10, mirrorHeight);
    rect(rightLineX, mirrorStartY, 10, mirrorHeight);
}

function drawObject(x, y) {
    ellipse(x, y, 20, 20)
}

function drawEye(x, y) {

    ellipse(x, y, 20, 10)
}

function mouseDragged(event) {
    if (event.clientX > 99 && event.clientX < 120) {
        console.log('left mirror ')
        //change mirror angle
    } else if (event.clientX > 200 && event.clientX < 220) {
        console.log('right mirror ')
        //change mirror angle
    }

}