"use strict";

const
    canvas                  = document.querySelector('#mc'),
    fieldCanv               = document.querySelector('#field'),
    ctx                     = canvas.getContext('2d'),
    fieldCtx                = fieldCanv.getContext('2d'),
    playerDefaultDimensions = [20, 20], // width, height
    viewport                = {w: 500, h: 500},
    player                  = [new PlayerPart(20, 20, ...playerDefaultDimensions, 'green')],
    world                   = {w: 2000, h: 2000},
    moveVector              = {x: 0, y: 0, angle: 0},
    mainCamera              = new Camera(world, viewport),
    field                   = new Field(world, viewport, mainCamera);

let playerLength            = 10;
let pattern = 'green';

/*const player = [
    new PlayerPart(20, 20, ...playerDefaultDimensions, 'green'),
    new PlayerPart(40, 20, ...playerDefaultDimensions, 'green'),
    new PlayerPart(60, 20, ...playerDefaultDimensions, 'green'),
];*/

canvas.width  = fieldCanv.width  = viewport.w;
canvas.height = fieldCanv.height = viewport.h;

function renderLoop() {
    ctx.clearRect(0, 0, viewport.w, viewport.h);

    for (const part of player) {
        const partRenderX = part.x - mainCamera.getXOffset();
        const partRenderY = part.y - mainCamera.getYOffset();

        ctx.fillStyle = pattern;

        drawRotatedRect({
            x: partRenderX,
            y: partRenderY,
            w: part.w,
            h: part.h,
        }, part.moveVector.angle);
    }

    field.renderField(fieldCtx);

    requestAnimationFrame(renderLoop);
}

renderLoop();

function gameLoop() {
    const head = player[player.length - 1];

    if (head.x + head.moveVector.x > world.w || head.y + head.moveVector.y > world.h) return;

    if (head.x + head.moveVector.x <= 0 || head.y + head.moveVector.y <= 0) return;

    const ratioX = playerDefaultDimensions[0] * head.moveVector.x;
    const ratioY = playerDefaultDimensions[1] * head.moveVector.y;

    //const newPart = new PlayerPart(head.x + head.moveVector.x, head.y + head.moveVector.y, ...playerDefaultDimensions, 'green');
    const newPart = new PlayerPart(head.x + ratioX, head.y + ratioY, ...playerDefaultDimensions, 'green');

    newPart.moveVector = JSON.parse(JSON.stringify(head.moveVector));

    player.push(newPart);

    if (player.length > playerLength) player.shift();

    mainCamera.observe(head);

    /*for (const part of player) {
        if (part.x + part.w >= world.w && part.moveVector.x > 0) part.moveVector.x = 0;
        else if (part.x <= 0 && part.moveVector.x < 0) part.moveVector.x = 0;

        if (part.y + part.h >= world.h && part.moveVector.y > 0) part.moveVector.y = 0;
        else if (part.y <= 0 && part.moveVector.y < 0) part.moveVector.y = 0;

        part.x += ;
        part.y += ;
    }*/
}

setInterval(gameLoop, 200);

document.addEventListener('mousemove', (e) => {
    const canvasCoords = canvas.getBoundingClientRect();

    const head = player[player.length - 1];

    const xRel = e.clientX - canvasCoords.left - (head.w / 2) + mainCamera.getXOffset();
    const yRel = e.clientY - canvasCoords.top - (head.h / 2) + mainCamera.getYOffset();

    const angle = Math.atan2(yRel - head.y, xRel - head.x);

    head.moveVector.x = Math.cos(angle);
    head.moveVector.y = Math.sin(angle);
    head.moveVector.angle = angle;
});

function drawRotatedRect(rect, rad) {
    // first save the untranslated/unrotated context
    ctx.save();

    ctx.beginPath();
    // move the rotation point to the center of the rect
    ctx.translate(rect.x + rect.w / 2, rect.y + rect.h / 2);
    // rotate the rect
    ctx.rotate(rad);

    // draw the rect on the transformed context
    // Note: after transforming [0,0] is visually [x,y]
    //       so the rect needs to be offset accordingly when drawn
    ctx.rect(-rect.w / 2, -rect.h / 2, rect.w, rect.h);
    //ctx.arc(-rect.w / 2, -rect.h / 2, rect.w / 2, 0, 2 * Math.PI);

    ctx.fill();

    ctx.closePath();

    // restore the context to its untranslated/unrotated state
    ctx.restore();
}

function randomHexColor() {
    return "#" + ((1<<24)*Math.random() | 0).toString(16);
}

var img = new Image();
img.src = 'snakeTexture.png';
img.onload = function() {
  pattern = ctx.createPattern(img, 'repeat');
  ctx.fillStyle = pattern;
};
