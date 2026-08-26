const yarn = document.getElementById("yarn");
const cat = document.getElementById("cat");
const finalMessage = document.getElementById("final-message");
const message = document.getElementById("message");

const purr = document.getElementById("purr");
const purrAndMiaw = document.getElementById("purrAndMiaw");
const celebration = document.getElementById("celebration");
const confettiCanvas = document.getElementById("confetti");
const restartButton = document.getElementById("restart-button");
const message = document.getElementById("message");

const ctx = confettiCanvas.getContext("2d");

let taps = 0;
let locked = false;

let confettiPieces = [];
let confettiAnimation = null;

const confettiColors = [
    "#f94144",
    "#f3722c",
    "#f9c74f",
    "#90be6d",
    "#43aa8b",
    "#577590",
    "#ffffff"
];

function resizeConfettiCanvas() {
    const dpr = window.devicePixelRatio || 1;

    confettiCanvas.width = window.innerWidth * dpr;
    confettiCanvas.height = window.innerHeight * dpr;

    confettiCanvas.style.width = window.innerWidth + "px";
    confettiCanvas.style.height = window.innerHeight + "px";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

resizeConfettiCanvas();

window.addEventListener("resize", resizeConfettiCanvas);


function createConfetti() {

    confettiPieces = [];

    const amount = 150;

    for (let i = 0; i < amount; i++) {

        confettiPieces.push({
            x: Math.random() * window.innerWidth,

            y: -Math.random() * window.innerHeight * 0.5,

            width: 6 + Math.random() * 7,

            height: 8 + Math.random() * 10,

            speedY: 2 + Math.random() * 4,

            speedX: -2 + Math.random() * 4,

            rotation: Math.random() * Math.PI * 2,

            rotationSpeed:
                -0.15 + Math.random() * 0.3,

            color:
                confettiColors[
                    Math.floor(
                        Math.random() *
                        confettiColors.length
                    )
                ]
        });
    }

    if (confettiAnimation) {
        cancelAnimationFrame(confettiAnimation);
    }

    animateConfetti();
}


function animateConfetti() {

    ctx.clearRect(
        0,
        0,
        window.innerWidth,
        window.innerHeight
    );

    let piecesStillFalling = false;

    for (const piece of confettiPieces) {

        piece.x += piece.speedX;

        piece.y += piece.speedY;

        piece.rotation += piece.rotationSpeed;

        if (piece.y < window.innerHeight + 30) {
            piecesStillFalling = true;
        }

        ctx.save();

        ctx.translate(
            piece.x,
            piece.y
        );

        ctx.rotate(piece.rotation);

        ctx.fillStyle = piece.color;

        ctx.fillRect(
            -piece.width / 2,
            -piece.height / 2,
            piece.width,
            piece.height
        );

        ctx.restore();
    }

    if (piecesStillFalling) {

        confettiAnimation =
            requestAnimationFrame(
                animateConfetti
            );

    } else {

        ctx.clearRect(
            0,
            0,
            window.innerWidth,
            window.innerHeight
        );
    }
}

function restart() {

    // Desbloquear el ovillo
    locked = false;

    // Reiniciar contador
    taps = 0;

    // Ocultar gato
    cat.classList.remove("show");

    // Ocultar mensaje final
    finalMessage.classList.remove("show");

    // Ocultar botón
    restartButton.classList.remove("show");

    // Mostrar mensaje inicial
    message.style.opacity = "1";

    // Restaurar posición del ovillo
    yarn.classList.remove(
        "move-one",
        "move-two",
        "disappear"
    );

    // Detener sonidos
    purr.pause();
    purr.currentTime = 0;

    celebration.pause();
    celebration.currentTime = 0;

    // Limpiar confeti
    confettiPieces = [];

    if (confettiAnimation) {
        cancelAnimationFrame(confettiAnimation);
    }

    ctx.clearRect(
        0,
        0,
        window.innerWidth,
        window.innerHeight
    );
}



function playPurr() {
    purr.currentTime = 0;

    purr.play().catch(error => {
        console.log("No se pudo reproducir el ronroneo:", error);
    });
}

function playPurrAndMiaw() {
    purrAndMiaw.currentTime = 0;

    purrAndMiaw.play().catch(error => {
        console.log("No se pudo reproducir el ronroneo:", error);
    });
}
function touchYarn(event) {

    // Evita que un mismo toque genere varias interacciones
    event.preventDefault();

    if (locked) return;

    taps++;

    console.log("Toque número:", taps);

    playPurrAndMiaw();

    if (taps === 1) {

        yarn.classList.remove("move-two");
        yarn.classList.add("move-one");

    } else if (taps === 2) {

        yarn.classList.remove("move-one");
        yarn.classList.add("move-two");

    } else if (taps === 3) {

    locked = true;

    message.style.opacity = "0";

    yarn.classList.add("disappear");

    setTimeout(() => {

        cat.classList.add("show");
        finalMessage.classList.add("show");

        createConfetti();

        purr.pause();
        purr.currentTime = 0;

        celebration.currentTime = 0;

        celebration.play().catch(error => {
            console.log(
                "No se pudo reproducir la celebración:",
                error
            );
        });

        // Mostrar botón después de unos segundos
        setTimeout(() => {
            restartButton.classList.add("show");
        }, 3000);

    }, 700);
}
}




// Pointer events funcionan tanto con mouse como con touch
yarn.addEventListener("pointerup", touchYarn);

restartButton.addEventListener(
    "click",
    restart
);
