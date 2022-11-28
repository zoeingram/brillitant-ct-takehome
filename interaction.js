
function setup() {
    angleMode(DEGREES);
    background(255);
}

let eyeAdjustment = 0;
const MIRROR_WIDTH = 10;

const MIRROR_SEPARATION_DISTANCE = 200;

function draw() {
    //
    // GENERAL SETUP
    //
    createCanvas(windowWidth, windowHeight + 100);
    // Set the center point of the window
    const centerPoint = windowWidth / 2;

    const distanceFromMidpoint = MIRROR_SEPARATION_DISTANCE / 2;
    // Set the positions of the mirror
    // Have to adjust for the MIRROR_WIDTH on the left side, so we add that
    const leftLineX = (centerPoint - distanceFromMidpoint) + MIRROR_WIDTH;
    const rightLineX = centerPoint + distanceFromMidpoint;

    const mirrorStartY = 20;
    const mirrorHeight = 500;
    const mirrorEndY = mirrorStartY + mirrorHeight;
    // Take the width back off the x coordinate
    drawMirrors(leftLineX - MIRROR_WIDTH, rightLineX, mirrorStartY, mirrorHeight);

    // Set the position of the reflected object
    const objX = centerPoint;
    const objY = mirrorHeight - 10

    drawObject(objX, objY);

    // Set the position of the eye
    const eyeX = objX + eyeAdjustment;
    const eyeY = mirrorHeight + 50;

    drawEye(eyeX, eyeY);

    // We have our coordinates, now we can draw the line
    line(eyeX, eyeY, objX, objY);

    //
    // INITIAL MATH + FIRST COLLISION
    //

    // We want to calculate theta based on the angle of intersection of the eye and the object
    // Since we have the x + y coordinates of both the eye and the object, it's easy to think of this as a right triangle, where we know the length of two sides.
    // In order to calculate the angle of theta, we can use arctangent to calculate the angle (see https://www.mathsisfun.com/algebra/trig-finding-angle-right-triangle.html) for some trig references.
    // We then add 90 degrees to correct the angle to the correct location
    let theta = 90 + atan((objX - eyeX) / (objY - eyeY));

    // A variable to track which side the line would be colliding with
    const collisionOnRightSide = eyeX < objX;
    const colisionLineX = collisionOnRightSide ? rightLineX : leftLineX;

    // Calculate the X component of the distance of the collision line
    const collisionLineXDist = colisionLineX - objX;
    // Opposite (Y) = Adjacent (X) * tan(theta)
    const reflectLineYDist = collisionLineXDist * tan(theta);
    // Set out coordinates
    const collisionLineY = objY - reflectLineYDist;

    if (collisionLineY > mirrorEndY) {
        // If we are in this conditional, then there is no colision of the line above and either of the mirrors. We can exit early
        return;
    }

    // If we have gotten this far, then we know a collision will happen.
    // Draw the line to the colliding mirror
    line(objX, objY, colisionLineX, collisionLineY);
    
    // Write theta to the screen
    fill(0);
    textSize(20);
    // Our calculations are technically not using exactly theta; they are using the converse of theta.
    // The math works either way, but for display, subtract 90.
    text("θ = " + Math.round(Math.abs(theta-90)), windowWidth - 200, 50);
    fill(235);

    /**
     * This function draws the remaining reflection collisions as well as the reflected objects
     * It operates recursively, so based on the initial theta (and the heights of the mirrors), it will draw all remaining reflections.
     * 
     * @param {*} startY the starting y position
     * @param {*} theta the current theta
     * @param {*} collisionOnTheRight a boolean of whether we are currently colliding on the right mirror. if false, that means we are colliding on the left side
     * @param {*} depth the depth of the recursion
     * @returns 
     */
    function drawReflection(startY, theta, collisionOnTheRight, depth = 0) {
        // Since we know we are on one of the mirrors, we can easily derive our starting and end x positions
        const startX = collisionOnTheRight ? rightLineX : leftLineX;
        const endX = collisionOnTheRight ? leftLineX : rightLineX;
        
        // The new theta value will be 180 minus theta because of the reflection.
        const reflectedTheta = 180 - theta;
        // Opposite (Y) = Adjacent (X) * tan(theta)
        // The positive vs. negative is just based on whether we are going right or left
        const newYDistance = (!collisionOnTheRight ? -1 : 1) * MIRROR_SEPARATION_DISTANCE * tan(reflectedTheta)
        const endY = startY + newYDistance;

        // Draw the new reflected line
        line(startX, startY, endX, endY);

        //
        // DRAWING THE REFLECTED OBJECT
        //
        let reflectedObjectX;
        // We could do more trig here since we have theta + the height, but we also know that the reflected object distance is a function of the number of reflections
        // 1. The first reflection will be the equal to the initial distance of the object to the reflecting surface
        // 2. The second reflection will be the distance of 1 + the distance in between the mirrors etc.
        const distance = depth * MIRROR_SEPARATION_DISTANCE + Math.abs(collisionLineXDist);
        if (collisionOnTheRight) {
            reflectedObjectX = distance + rightLineX;
        } else {
            reflectedObjectX = leftLineX - distance;
        }
        // Draw the virtual mirrors ad-hoc
        if (depth > 0) {
            drawMirrors(leftLineX - depth*MIRROR_SEPARATION_DISTANCE, rightLineX + depth*MIRROR_SEPARATION_DISTANCE, mirrorStartY, mirrorHeight);
        }

        // Draw the reflected object
        drawObject(reflectedObjectX, objY);

        // Draw a reflected line from the collision point to the reflected object
        setLineDash([5, 5]);
        line(startX, startY, reflectedObjectX, objY);
        setLineDash([]);

        // If the next set of lines is going to be beyond the mirror, we can stop the recursion
        if (endY < mirrorStartY) {
            return;
        }
        // Recurse again on the other side
        drawReflection(endY, reflectedTheta, !collisionOnTheRight, depth + 1);
    }

    // Start the recursion
    drawReflection(collisionLineY, theta, collisionOnRightSide);
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
        eyeAdjustment -= 15;
        draw();
    } else if (keyCode === RIGHT_ARROW) {
        eyeAdjustment += 15
        draw();
    }
}