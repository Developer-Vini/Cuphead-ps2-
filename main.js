const canvasWidth = 640;
const canvasHeight = 448;
let posX = 250;
let posY = 250;
let velY = 0;
let gravity = 0.5;
let jumpForce = -10;
let noChao = true;
let pulando = false;

let facingLeft = false;

const canvas = Screen.getMode();
canvas.width = canvasWidth;
canvas.height = canvasHeight;
Screen.setMode(canvas);

class Animation {
    constructor(frames, fps) {
        this.frames = frames.map(frame => new Image(frame));
        this.fps = 1000000 / fps;
        this.timer = Timer.new();
        this.frame = 0;
    }

    draw(x, y, flipHorizontal = false) {
        if (Timer.getTime(this.timer) >= this.fps) {
            this.frame = (this.frame + 1) % this.frames.length;
            Timer.setTime(this.timer, 1);
        }

        const currentImage = this.frames[this.frame];

        if (flipHorizontal) {
            currentImage.startx = currentImage.width;
            currentImage.endx = 0;
        } else {
            currentImage.startx = 0;
            currentImage.endx = currentImage.width;
        }

        currentImage.draw(x, y);
    }
}
const overlay = new Image("overlay.png");
const background = new Image("background.png");
const jumpFrames = ["jump/1.png", "jump/2.png", "jump/3.png", "jump/4.png", "jump/5.png", "jump/6.png", "jump/7.png", "jump/8.png"];
const tsgFrames = ["Air/1.png", "Air/2.png", "Air/3.png", "Air/4.png", "Air/5.png", "Air/6.png"];
const agaFrames = ["ag/1.png", "ag/2.png", "ag/3.png", "ag/4.png", "ag/5.png", "ag/6.png", "ag/7.png", "ag/8.png"];
const runFrames = ["Run/Normal/1.png", "Run/Normal/2.png", "Run/Normal/3.png", "Run/Normal/4.png", "Run/Normal/5.png", "Run/Normal/6.png", "Run/Normal/7.png", "Run/Normal/8.png", "Run/Normal/9.png"];
const idleFrames = ["Idle/1.png", "Idle/2.png", "Idle/3.png", "Idle/4.png", "Idle/5.png", "Idle/6.png", "Idle/7.png", "Idle/8.png"];
const idleElder = ["elder/idle/tile000.png", "elder/idle/tile001.png", "elder/idle/tile002.png", "elder/idle/tile003.png", "elder/idle/tile004.png", "elder/idle/tile005.png", "elder/idle/tile006.png"]

const runAnimation = new Animation(runFrames, 50);
const idleAnimation = new Animation(idleFrames, 20);
const agacharAnimation = new Animation(agaFrames, 15);
const specialAnimation = new Animation(tsgFrames, 20);
const jumpAnimation = new Animation(jumpFrames, 20);
const AnimationElder = new Animation(idleElder, 20);

let currentAnimation = idleAnimation;
let pad = Pads.get();
let oldPad = pad;
while (true) {
    Screen.clear();
    background.draw(0, 0);
    overlay.draw(0, 0);
    oldPad = pad;
    pad = Pads.get();
    jumpPlayer();
    movePlayer();
    atualizarAnimacao();
    AnimationElder.draw(480, 217)
    currentAnimation.draw(posX, posY, facingLeft);
    Screen.flip();
}

function atualizarAnimacao() {
    if (pad.pressed(Pads.CIRCLE)) {
        currentAnimation = specialAnimation;
        return;
    }
    if (!noChao) {
        currentAnimation = jumpAnimation;
        return;
    }
    if (pad.pressed(Pads.DOWN)) {
        currentAnimation = agacharAnimation;
        return;
    }
    if (pad.pressed(Pads.RIGHT) || pad.pressed(Pads.LEFT)) {
        currentAnimation = runAnimation;
        return;
    }
    currentAnimation = idleAnimation;
}

function movePlayer() {
    if (pad.pressed(Pads.RIGHT)) {
        posX += 5;
        facingLeft = false;
    }

    if (pad.pressed(Pads.LEFT)) {
        posX -= 5;
        facingLeft = true;
    }
    if (pad.pressed(Pads.CROSS) && noChao) {
        velY = jumpForce;
        noChao = false;
    }
}

function jumpPlayer() {
    velY += gravity;
    posY += velY;

    if (posY >= 250) {
        posY = 250;
        velY = 0;
        noChao = true;
    } else {
        noChao = false;
    }
}
