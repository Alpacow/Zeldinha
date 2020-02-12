$(document).ready(canvasApp);

function canvasApp() {

    var canvas = $('#canvas')[0];
    var context = canvas.getContext('2d');

    var loop = setInterval(isLoading, 60);
    var fps = 20;
    var xr, yr, hr, wr, xg, yg, rg;
    var xc, yc, rc;
    var key, load = 0, total = 2;
    var gameover;
    var theme, dead;
    var score = 0;
    var imgLink = new Image();
    var csxLink = 0;
    var csyLink = 0;
    var stateLink = 'stop';
    
    var imgEne1 = new Image();
    var csxEnemy1 = 0;
    var csyEnemy1 = 0;
    
    var map = new Image();
    var dif;
    var velocity;

    loadAssets();
    controls();

    function isLoading() {
        if (load >= total) {
            clearInterval(loop);
            start();
        }
        context.fillStyle = '#0d4d0dba';
        context.strokeStyle = '#1c1c1c';
        context.fillRect(50, 25, 200 * (load / total), 25);
        context.strokeRect(50, 25, 200, 25);
    }


    function start() {
        gameover = false;
        drawScreen();
        dif = 0; 
        velocity = 4;
        
        xr = canvas.width/2;
        yr = canvas.height/2;
        hr = 30;
        wr = hr;
        xg = Math.random() * canvas.width;
        yg = Math.random() * canvas.height;
        rg = 25;
        xc = Math.random() * canvas.width;
        yc = 0;
        rc = 25;
        score = 0;
        
        // Enemies
        xEnemy2 = canvas.width + 15;
        yEnemy2 = Math.random() * canvas.height;
        rEnemy2 = 25;

        rEnemy4 = Math.random() * canvas.width;
        yEnemy4 = canvas.height - 5;
        rEnemy4= 25;

        xEnemy3 = -5;
        yEnemy3 = Math.random() * canvas.height;
        rEnemy3= 15;

        // loop
        if (typeof theme.loop === 'boolean') {
            theme.loop = true;
        } else {
            theme.addEventListener('ended', function () {
                this.currentTime = 0;
            }, false);
        }
        theme.play();
    }

    function drawScreen() {
        setTimeout(function () {
            drawBackground();
            moveLink();
            moveCirculo(); 

            if (colide(xr, yr, wr, hr, xc, yc, rc)) {
                theme.pause();
                theme.currentTime = 0;
                dead.play();
                gameover = true;
            }

            if (colide(xr, yr, wr, hr, xg, yg, rg)) {
                score++;
                dif++;
                portal.play();
                dif++;
                xg = rg + (Math.random() * canvas.width - rg);
                yg = rg + (Math.random() * canvas.height - rg);
            }
            
            //aumenta velocidade dos inimigos
            if(dif > 11 && velocity < 30){
               dif = 0;
               velocity += 5;
            }

            drawRectLink();
            drawLink();
            drawCircle();
            drawnText();

            // canvas stroke
            context.strokeStyle = "#1c1c1c";
            context.strokeRect(0, 0, canvas.width, canvas.height);

            if (!gameover) {
                window.requestAnimationFrame(drawScreen);
            }

        }, 1000 / fps);
    }

    function moveLink() {
        if (key == 38) {
            stateLink = 'up';
            if (yr <= 0) {
                yr = 0;
            } else {
                yr -= 10;
            }
        } else if (key == 40) {
            stateLink = 'down';
            //console.log(yr);
            //console.log(canvas.height - hr);
            if (yr >= canvas.height - hr) {
                yr = canvas.height - hr;
            } else {
                yr += 10;
            }
        } else if (key == 39) {
            xr += 10;
            stateLink = 'right';
        } else if (key == 37) {
            xr -= 10;
            stateLink = 'left';
        }
    }

    function moveCirculo() {
        yc += velocity;
        if (yc > canvas.height) {
            yc = 0;
            xc = Math.random() * canvas.width;
        }
    }

    function drawBackground(){
        var pattern = context.createPattern(map, 'repeat');
        context.fillStyle = pattern;
        context.fillRect(0, 0, canvas.width, canvas.height);
    }

    function drawnText() {
        context.shadowColor = "#000";
        context.shadowOffsetX = 0; 
        context.shadowOffsetY = 0; 
        context.font = "30px 'triforce'";
        context.textBaseline = 'alphabetic';
        context.scale(1,1);
        context.fillStyle = "#1c1c1c";
        context.baseLine = "top";

        if (gameover) {
            context.fillText("Aperte ENTER para reiniciar: " + score, canvas.width / 8, canvas.height - 10);
        } else {
            context.fillText("Pontos: " + score, canvas.width / 2, canvas.height - 10);
        }
        context.shadowColor = "transparent";
    }

    function drawRectLink() {
        //Retangulo
        context.fillStyle = "#00f";
        context.fillRect(xr, yr, wr, hr);
    }
    
    function drawLink(){
        if(stateLink == 'down')
            csyLink = 1;
        else if(stateLink=='up')
            csyLink = 26 * 2;
        else if(stateLink=='right')
            csyLink = 26 * 3;
        else if(stateLink=='left')
            csyLink = 26 * 1;
        else{
            csyLink = 1;
            csxLink = 2;
        }        
        context.drawImage(imgLink, 26 * csxLink, csyLink, 26 , 26, xr-5, yr-5, 40, 40);
        csxLink++;
        if(csxLink>9)
            csxLink = 0;
    }

    function drawCircle() {
       context.beginPath();
       context.strokeStyle = '#000';
       context.lineWidth = 2;
       context.arc(
               xc,
               yc,
               rc,
               (Math.PI / 180) * 0,
               (Math.PI / 180) * 360,
               false
               );
       context.fillStyle = "#f00";
       context.fill();
       context.stroke();
       context.closePath();

        /*context.drawImage(imgEne1,82*csxEnemy1,csyEnemy1,82,124,xc-19,yc-25,40,60);
        csxEnemy1++;
        if(csxEnemy1>1)
            csxEnemy1 = 0;*/
    }

    function colide(x, y, w, h, cx, cy, cr) {
        x = x - cr;
        y = y - cr;
        w = w + cr * 2;
        h = h + cr * 2;
        if ((cx >= x && cx <= x + w) &&
                (cy >= y && cy <= y + h)
                ) {
            return true;
        } else {
            return false;
        }
    }

    function loadAssets() {
        imgLink.src = "img/links.png";
        map.src = "img/map_bg.png";

        imgEne1.src = "img/ene1.png";
        
        imgLink.onload = function () {
            load++;
        };

        map.onload = function () {
            load++;
        };

        dead = new Audio('sounds/dead.mp3');
        dead.load();
        dead.volume = 0.5;
        dead.addEventListener('canplaythrough', function () {
            load++;
        }, false);


        theme = new Audio('sounds/theme.mp3');        
        theme.load();
        theme.volume = 0.1;
        theme.addEventListener('canplaythrough', function () {
            load++;
        }, false);
    }

    function controls() {
        $(document).keydown(function (e) {
            key = e.which;
            //console.log(key);
            if (key === 13 && gameover)
                start();
        });

        $(document).keyup(function (e) {
            key = null;
            stateLink = 'stop';
        });
    }
}