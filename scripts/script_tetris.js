/* Travail réstant :
 FAIT : - Corriger le bug de la brick qui ne veut pas descendre -> Très dur
 FAIT : - Gérer le cas de la border male faite -> Chiant
 FAIT : - Rendre le jeu un peu plus esthétique -> Simple
 FAIT : - Rajouter un icone à la page -> Très simple -> A pris 30 ans a cause des formats
 FAIT : - Emepêcher de tourner sous certaines conditions -> Compliqué, pas vu le current_state
 FAIT : - Rajouter le son -> Très simple -> Juste le rotate fail, va avec le fait d'empecher de tourner 
 FAIT : - Gérer le cas des niveaux et de l'accélération
 FAIT : - Gérer les boutons -> Gérer le hold
 FAIT : - Rajouter le pause -> Dur -> En vrai tranquille, galère a comprendre mais chatgpt quel bg
 FAIT : - Centrer les bricks dans le next move -> Simple
 FAIT : - Gérer la défaite -> Très simple
- Gérer le score - > Chiant, Bof, trop galère, grosse flemme pour l'instant
- Gérer la possibilité de jouer sur Ipad -> Dur -> Presue fini
*/

var array = []
var next = []
var colors = ["green", "orange", "red", "cyan", "yellow", "blue", "purple"]
var forms = ["L", "J", "O", "Z", "S", "T", "I"]

var form = forms[random(forms.length)];

var current_form = forms[random(forms.length)];

var current_state = 0;

var score = 0;
var score_lines = 0;
var level = 1;
var time = 500 * (0.85 ** (level - 1));

var DIC = {1 : "L", 2 : "J", 3 : "O", 4 : "Z", 5 : "S", 6 : "T", 7 : "I"}
var gamePaused = false;
var is_swiping = false;
/*
Les numéros : 
- 0 : rien
- 1 : L
- 2 : J
- 3 : O
- 4 : Z
- 5 : S
- 6 : T
- 7 : I
- 8 : état d'arret
*/



/* Fonctions for the next move*/

function transform_id_next_move(i,j){
    return i*4 + j
}

function next_move(next, form){
    reset(next)
    if(form == "I"){
        construct(next, 1, 0, form)
     }else {
    construct(next, 1, 1, form)
    }
    for(i=0; i<4; i++){
        for(j=0; j<4;j++){
            id = 1000 + transform_id_next_move(i,j)
            el = document.getElementById(id)
            if(next[i][j] != 0){
                el.classList.add("brick")
                el.classList.add(DIC[next[i][j]])
            }
        }
    }
}

function reset(L){
    for(i=0; i<4; i++){
        for(j=0; j<4;j++){
            id = 1000 + transform_id_next_move(i,j)
            el = document.getElementById(id)
            L[i][j] = 0
            el.setAttribute("class", "cell_inf");
        }
    }
}

function init_next(){   
    parent = document.getElementById("nxtmove")
    let cpt = 1000
    for(i=0; i<4; i++){
        next.push([])
        for(j=0; j<4;j++){
            cell = document.createElement("div")
            cell.className = "cell_inf"
            cell.id = cpt
            parent.appendChild(cell)
            next[i].push(0)
            cpt++;
    }
}
}








function random(max) {
    return Math.floor(Math.random() * max);
}


function init(){  
    /* Initialise the board */ 
    parent = document.getElementById("playboard")
    let cpt = 0
    for(i=0; i<18; i++){
        array.push([])
        for(j=0; j<10;j++){
            cell = document.createElement("div")
            cell.className = "cell"
            cell.id = cpt
            parent.appendChild(cell)
            array[i].push(0)
            cpt++;
    }
}
}


function transform_id(i, j){
    /* Transform the coordinates into the id */
    return i*10+ j
}

function transform_with_id_to_j(id){
    return id%10
}

function construct(L, i, j, form){
    /* Construct original forms */
    if(form == "L"){
        L[i][j] = 1
        L[i][j+1] = 1
        L[i][j+2] = 1
        L[i+1][j] = 1
    } else if(form == "J"){
        L[i][j] = 2
        L[i][j+1] = 2
        L[i][j+2] = 2
        L[i+1][j+2] = 2
    } else if(form == "O"){
        L[i][j] = 3
        L[i+1][j] = 3
        L[i][j+1] = 3
        L[i+1][j+1] = 3
    } else if(form == "Z"){
        L[i][j] = 4
        L[i][j+1] = 4
        L[i+1][j+1] = 4
        L[i+1][j+2] = 4
    } else if(form == "S"){
        L[i][j+1] = 5
        L[i][j+2] = 5
        L[i+1][j] = 5
        L[i+1][j+1] = 5
    } else if(form== "T"){
        L[i][j] = 6
        L[i][j+1] = 6
        L[i][j+2] = 6
        L[i+1][j+1] = 6
    } else if(form == "I"){
        L[i][j] = 7
        L[i][j+1] = 7
        L[i][j+2] = 7
        L[i][j+3] = 7
    }
    
}




function show(L) {
    for(i=0; i<18; i++){
        for(j=0; j<10;j++){
            el = document.getElementById(transform_id(i,j))
            if(L[i][j] == 0 && el.classList.contains("brick")){
                el.setAttribute("class", "cell");
            } else if((0 < L[i][j] && L[i][j] < 8) && !(el.classList.contains("brick"))){
                el.classList.add("brick")
                el.classList.add(DIC[L[i][j]])
            }
        }
    }
}


function change(L){
    for(i=0; i<18; i++){
        for(j=0; j<10;j++){
            if(0 < L[i][j] && L[i][j] < 8){
                L[i][j] = 8
            }
        }
    }
    new Audio("./../tetris_sounds/SFX_PieceTouchDown.ogg").play();
}

function check_end(L){
    /* Checks if the brick can stop */
    chnge = false
    for(i=0; i<18; i++){
        for(j=0; j<10;j++){
            if((0 < L[i][j] && L[i][j] < 8) && (i == 17 || L[i+1][j] == 8)){
                chnge = true
            }
        }
    } if(chnge == true){
        console.log(array);
        change(L);
        construct(L, 0, 4, form);
        current_state = 0;
        current_form = form;
        form = forms[random(forms.length)];
        next_move(next, form);
        time = 500 * (0.85 ** (level - 1)); /* Reset speed when new brick spawns */
    }
}

function move(L){
    for(i=17; i>=0; i--){
        for(j=9; j>=0;j--){
            if(0 < L[i][j] && L[i][j] < 8){
                L[i+1][j] = L[i][j]
                L[i][j] = 0
            }
        }
    }
    new Audio("./../tetris_sounds/SFX_PieceFall.ogg").play();
}

function checks_lost(L){
    for(j=0; j<10;j++){
        if(L[2][j] == 8 && j >= 4 && j <= 7){
            return true
        }
    }
    return false
}

function put_back_lines(L, lines){
    for(t=0;t<lines.length;t++){
        for(p=0;p<10;p++){
            document.getElementById(transform_id(lines[t], p)).setAttribute("class", "cell brick animation");
        }
    }
}


async function animation_clear_line(L, lines){
    
    /*for(m=0;m<lines.length;m++){
        brick_class = []
        for(n=0;n<10;n++){
            brick_class.push(document.getElementById(transform_id(lines[m], n)).classList)

        }
        
    }*/
    
    new Audio("./../tetris_sounds/SFX_SpecialLineClearSingle.ogg").play();
    remove_lines(L, lines);
    show(L)
    await sleep(200)
    put_back_lines(L, lines)
    await sleep(200)
    show(L)
    await sleep(200)
    put_back_lines(L, lines)
    show(L)
        
    
    
}


function checks_win(L){
    lines = [];
    for(i=0; i<18; i++){
        counter = 0;
        for(j=0; j<10;j++){
            if(L[i][j] == 8){
                counter++;
            }

        }
        if(counter==10){
            lines.push(i);
        }
    }
    if(lines.length > 0){
        gamePaused = true
        animation_clear_line(L, lines)
        setTimeout(function(){
            bring_down(L, lines)
            gamePaused = false
        },700) 
    }
}

function remove_lines(L, lines){
    for(i of lines){
        console.log(i, lines)
        for(j=0; j<10;j++){
            L[i][j] = 0
        }/*bring_down_line(L, i)*/
    }
    
    
}

/*function bring_down_line(L, line){
    for(i=line-1; i >=0; i--){
        for(j=0; j<10; j++){
            if(L[i][j] == 8){
                el = document.getElementById(transform_id(i, j))
                L[i+1][j] = 8
                document.getElementById(transform_id(i+1, j)).classList = el.classList
                L[i][j] = 0 
                el.setAttribute("class", "cell");
            }
        }
    }
}
*/

function bring_down(L, lines){
    cpt = 0;
    while(cpt < lines.length){
        for(i=lines[cpt]-1; i >=0; i--){
            for(j=0; j<10; j++){
                if(L[i][j] == 8){
                    el = document.getElementById(transform_id(i, j))
                    L[i+1][j] = 8
                    document.getElementById(transform_id(i+1, j)).classList = el.classList
                    L[i][j] = 0 
                    el.setAttribute("class", "cell");
                }
            }
        }
        cpt++;
    }
    score_lines = score_lines + cpt
    old_lvl = level
    level = 1 + Math.floor(score_lines / 10);
    document.getElementById("lines").innerHTML = score_lines
    document.getElementById("level").innerHTML = level
    time = 500 * (0.85 ** (level - 1));
    if(old_lvl != level){
        new Audio("./../tetris_sounds/next-level.mp3").play();
    }
    
}








function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}



/* Main loop */
async function speed(array){
    play = true
    while(play==true){
        await sleep(time)
        if(!gamePaused){
            check_end(array)
            move(array)
            checks_win(array)
            if(checks_lost(array) == true){
                play = false
                document.getElementById("overlay").classList.add("show")
                document.getElementById("perdu").classList.add("active")
                document.getElementById("level_end").innerText = level;
                document.getElementById("lines_end").innerText = score_lines;
                document.getElementById("score_end").innerText = score;
                new Audio("./../tetris_sounds/game-over.mp3").play();
                /*alert("you have lost")*/
            }
            show(array)
        }         
    }
}



function pauseGame() {
    if (gamePaused == false){
        document.getElementById("pause").innerHTML = "play_circle_outline"
    } else {
        document.getElementById("pause").innerText = "pause_circle_outline"
    }
    gamePaused = !gamePaused;
}

/* Starting code */
setTimeout(function(){
    main_theme = new Audio("./../tetris_sounds/Tetris_Theme_Officiel.mp3");
    main_theme.loop = true
    main_theme.play();
    init()
    init_next()
    show(array)
    construct(array, 1, 4, current_form)
    next_move(next, form) 
    show(array)
    speed(array)
    arrows(onpointerdown, onpointerup)
    
    
}, 100);





function arrows(type_down, type_up){
    document.getElementById("arrow-left").onpointerdown = function() {
        isButtonDown_left = true
        check_left(array)
        show(array)
        color("left");
        setTimeout(function(){
        repeat_left = setInterval(function(){
            if(isButtonDown_left){
            check_left(array)
            show(array)
            color("left");
        } else {
            clearInterval(repeat_left)
            return_color("left");
        }
        }, 100)}, 500)
    };
    document.getElementById("arrow-right").onpointerdown = function() {
        isButtonDown_right = true
        check_right(array)
        show(array)
        color("right");
        setTimeout(function(){
        repeat_right = setInterval(function(){ 
            if(isButtonDown_right){
            check_right(array)
            show(array)
            color("right");
        } else {
            clearInterval(repeat_right)
            return_color("right");
        }
        }, 100)}, 500)
    };
    document.getElementById("arrow-up").onpointerdown = function() {
        isButtonDown_up = true
        turn(array, current_form) 
        show(array)
        color("up");
        setTimeout(function() {
            repeat_up = setInterval(function() { 
                if(isButtonDown_up){
                turn(array, current_form); 
                show(array);
                color("up");
            } else {
                clearInterval(repeat_up);
                return_color("up");
            }
              }, 50);}, 500);
    };

    
    document.getElementById("arrow-down").onpointerdown = function() {
        time = 40
        color("down");
    };
    
    
    document.getElementById("arrow-down").onpointerup = function() {
        time = 500 * (0.8 ** (level - 1))
        return_color("down");
    };
    document.getElementById("arrow-left").onpointerup = function() {
        isButtonDown_left = false
        clearInterval(repeat_left)
        return_color("left");
    };
    document.getElementById("arrow-right").onpointerup = function() {
        isButtonDown_right = false
        clearInterval(repeat_right)
        return_color("right");
    };
    document.getElementById("arrow-up").onpointerup = function() {
        isButtonDown_up = false
        clearInterval(repeat_up);
        return_color("up");
        console.log("mouseup event triggered");
    };
}


function color(direction){
    document.getElementById("arrow-" + direction).style.backgroundColor = "#00c180";
}

function return_color(direction){
    document.getElementById("arrow-" + direction).style.backgroundColor = "aquamarine";
}



document.addEventListener("keydown", (e) => {
            e = e || window.event;
            if (e.key === "ArrowUp") {
              turn(array, current_form);
              color("up");
            } else if (e.key === "ArrowDown") {
              time = 40;
              color("down");
            } else if (e.key === "ArrowLeft") {
              check_left(array);
              color("left");
            } else if (e.key === "ArrowRight") {
              check_right(array);
              color("right");
            }
            show(array)
        });

    
document.addEventListener("keyup", (e) => {
    e = e || window.event;
    if (e.key === "ArrowDown") {
        time = 500 * (0.85 ** (level - 1));
        return_color("down")
    } else if (e.key === "ArrowUp") {
        return_color("up");
    } else if (e.key === "ArrowLeft") {
        return_color("left");
    } else if (e.key === "ArrowRight") {
        return_color("right");
    }
});







function check_right(L){
    /* Checks if the brick is allowed to move to the right and if so calls the fonction right() */
    can_right = true
    for(i=0; i<18; i++){
        for(j=9; j>=0;j--){
            if(0 < L[i][j] && L[i][j] < 8 && (j == 9 || (L[i][j+1] != 0 && L[i][j] != L[i][j+1]))){
                console.log(L[i][j], L[i][j+1])
                can_right = false
            }
        }
    }if(can_right == true && !gamePaused){
        right(L)
        new Audio("./../tetris_sounds/SFX_PieceMoveLR.ogg").play();
    } else{
        new Audio("./../tetris_sounds/SFX_PieceTouchLR.ogg").play();
    }
}

function check_left(L){
    /* Checks if the brick is allowed to move to the left and if so calls the fonction left() */
    can_left = true
    for(i=0; i<18; i++){
        for(j=0; j<10;j++){
            if(0 < L[i][j] && L[i][j] < 8 && (j == 0 || (L[i][j-1] != 0 && L[i][j] != L[i][j-1]))){
                can_left = false
            }
        }
    }if(can_left == true && !gamePaused){
        left(L)
        new Audio("./../tetris_sounds/SFX_PieceMoveLR.ogg").play();
    } else{
        new Audio("./../tetris_sounds/SFX_PieceTouchLR.ogg").play();
    }
}

function right(L){
    /* Move brick to the right */
    for(i=0; i<18; i++){
        for(j=9; j>=0;j--){
            if(0 < L[i][j] && L[i][j] < 8 && j != 9 && L[i][j+1] == 0){
                L[i][j+1] = L[i][j]
                L[i][j] = 0
            }
        }
    }
}

function left(L){
    /* Move brick to the left */
    for(i=0; i<18; i++){
        for(j=0; j<10;j++){
            if(0 < L[i][j] && L[i][j] < 8 && j != 0 && L[i][j-1] == 0){
                L[i][j-1] = L[i][j]
                L[i][j] = 0
            }
        }
    }
}




function turn(L, current_form){
    /* Fonction to make forms turn */
    if(current_form == "L"){
        if(current_state == 0){
            for(i=0; i<18; i++){
                for(j=0; j<10;j++){
                    if(L[i][j] == 1 && L[i][j+1] == 1 && L[i][j+2] == 1 && L[i+1][j] == 1){
                        if(i != 0 && i != 17 && j != 9 && L[i-1][j] == 0 && L[i-1][j+1] == 0 && L[i+1][j+1] == 0 && !gamePaused){
                            L[i-1][j] = 1
                            L[i-1][j+1] = 1
                            L[i+1][j+1] = 1

                            L[i][j] = 0
                            L[i][j+2] = 0
                            L[i+1][j] = 0
                            current_state = 1
                            new Audio("./../tetris_sounds/SFX_PieceRotateLR.ogg").play();
                        } else {
                            new Audio("./../tetris_sounds/SFX_PieceRotateFail.ogg").play();
                        }
                }
                }
            }
            
        } else if(current_state == 1){
            for(i=0; i<18; i++){
                for(j=0; j<10;j++){
                    if(L[i][j] == 1 && L[i][j+1] == 1 && L[i+1][j+1] == 1 && L[i+2][j+1] == 1){
                        if(j < 8 && i != 17 && L[i][j+2] == 0 && L[i+1][j+2] == 0 && L[i+1][j] == 0 && !gamePaused) {
                            L[i][j+2] = 1
                            L[i+1][j+2] = 1
                            L[i+1][j] = 1

                            L[i][j] = 0
                            L[i][j+1] = 0
                            L[i+2][j+1] = 0
                            current_state = 2
                            new Audio("./../tetris_sounds/SFX_PieceRotateLR.ogg").play();
                        } else {
                            new Audio("./../tetris_sounds/SFX_PieceRotateFail.ogg").play();
                        }
                }
                    
                }
            }
            
        } else if(current_state == 2){
            for(i=0; i<18; i++){
                for(j=0; j<10;j++){
                    if(L[i][j] == 1 && L[i+1][j] == 1 && L[i+1][j-1] == 1 && L[i+1][j-2] == 1){
                        if(j != 0 && i < 16 && L[i][j-1] == 0 && L[i+2][j-1] == 0 && L[i+2][j] == 0 && !gamePaused){
                            L[i][j-1] = 1
                            L[i+2][j-1] = 1
                            L[i+2][j] = 1

                            L[i][j] = 0
                            L[i+1][j] = 0
                            L[i+1][j-2] = 0
                            current_state = 3
                            new Audio("./../tetris_sounds/SFX_PieceRotateLR.ogg").play();
                        } else{
                            new Audio("./../tetris_sounds/SFX_PieceRotateFail.ogg").play();
                        }
                    }
                    
                }
            }
            
        } else if(current_state == 3){
            for(i=0; i<18; i++){
                for(j=0; j<10;j++){
                    if(L[i][j] == 1 && L[i+1][j] == 1 && L[i+2][j] == 1 && L[i+2][j+1] == 1){
                        console.log(j)
                        if(i < 16 && j != 0 && j != 9 && L[i+2][j-1] == 0 && L[i+1][j-1] == 0 && L[i+1][j+1] == 0 && !gamePaused){
                            L[i+2][j-1] = 1
                            L[i+1][j-1] = 1
                            L[i+1][j+1] = 1

                            L[i][j] = 0
                            L[i+2][j] = 0
                            L[i+2][j+1] = 0
                            current_state = 0
                            new Audio("./../tetris_sounds/SFX_PieceRotateLR.ogg").play();
                        }else {
                            new Audio("./../tetris_sounds/SFX_PieceRotateFail.ogg").play();
                        }
                }
                    
                }
            }
            
        }
    }else if(current_form == "J"){
        if(current_state == 0){
            for(i=0; i<18; i++){
                for(j=0; j<10;j++){
                    if(L[i][j] == 2 && L[i][j+1] == 2 && L[i][j+2] == 2 && L[i+1][j+2] == 2){
                        if(i != 17 && i != 0 && j != 9 && L[i+1][j] == 0 && L[i+1][j+1] == 0 && L[i-1][j+1] == 0 && !gamePaused){
                            L[i+1][j] = 2
                            L[i+1][j+1] = 2
                            L[i-1][j+1] = 2

                            L[i][j] = 0
                            L[i][j+2] = 0
                            L[i+1][j+2] = 0
                            current_state = 1
                            new Audio("./../tetris_sounds/SFX_PieceRotateLR.ogg").play();
                        } else {
                            new Audio("./../tetris_sounds/SFX_PieceRotateFail.ogg").play();
                        }
                    }
                }
            }
            
        } else if(current_state == 1){
            for(i=0; i<18; i++){
                for(j=0; j<10;j++){
                    if(L[i][j] == 2 && L[i+1][j] == 2 && L[i+2][j] == 2 && L[i+2][j-1] == 2){
                        if(j != 0 && j != 9 && i != 17 && L[i][j-1] == 0 && L[i+1][j-1] == 0 && L[i+1][j+1] == 0 && !gamePaused){
                            L[i][j-1] = 2
                            L[i+1][j-1] = 2
                            L[i+1][j+1] = 2

                            L[i][j] = 0
                            L[i+2][j] = 0
                            L[i+2][j-1] = 0
                            current_state = 2
                            new Audio("./../tetris_sounds/SFX_PieceRotateLR.ogg").play();
                        } else{
                            new Audio("./../tetris_sounds/SFX_PieceRotateFail.ogg").play();
                        }

                    }
                    
                }
            }
            
        } else if(current_state == 2){
            for(i=0; i<18; i++){
                for(j=0; j<10;j++){
                    if(L[i][j] == 2 && L[i+1][j] == 2 && L[i+1][j+1] == 2 && L[i+1][j+2] == 2){
                        if(j < 8 && i < 16 && L[i][j+1] == 0 && L[i][j+2] == 0 && L[i+2][j+1] == 0 && !gamePaused){
                            L[i][j+1] = 2
                            L[i][j+2] = 2
                            L[i+2][j+1] = 2

                            L[i][j] = 0
                            L[i+1][j] = 0
                            L[i+1][j+2] = 0
                            current_state = 3
                            new Audio("./../tetris_sounds/SFX_PieceRotateLR.ogg").play();
                        } else{
                            new Audio("./../tetris_sounds/SFX_PieceRotateFail.ogg").play();
                        }
                    }
                    
                }
            }
            
        } else if(current_state == 3){
            for(i=0; i<18; i++){
                for(j=0; j<10;j++){
                    if(L[i][j] == 2 && L[i+1][j] == 2 && L[i+2][j] == 2 && L[i][j+1] == 2){
                        if(i < 16 && j != 9 && j != 0 && L[i+1][j-1] == 0 && L[i+2][j+1] == 0 && L[i+1][j+1] == 0 && !gamePaused){
                            L[i+1][j-1] = 2
                            L[i+2][j+1] = 2
                            L[i+1][j+1] = 2

                            L[i][j] = 0
                            L[i][j+1] = 0
                            L[i+2][j] = 0

                            current_state = 0
                            new Audio("./../tetris_sounds/SFX_PieceRotateLR.ogg").play();
                            
                        } else{
                            new Audio("./../tetris_sounds/SFX_PieceRotateFail.ogg").play();
                        }
                    }
                    
                }
            }
            
        }

    }else if(current_form == "Z"){
        if(current_state == 0){
            for(i=0; i<18; i++){
                for(j=0; j<10;j++){
                    if(L[i][j] == 4 && L[i][j+1] == 4 && L[i+1][j+1] == 4 && L[i+1][j+2] == 4){
                        if(j < 8 && i != 0 && L[i][j+2] == 0 && L[i-1][j+2] == 0 && !gamePaused){
                            L[i][j+2] = 4
                            L[i-1][j+2] = 4

                            L[i][j] = 0
                            L[i+1][j+2] = 0

                            current_state = 1
                            new Audio("./../tetris_sounds/SFX_PieceRotateLR.ogg").play();
                        } else {
                            new Audio("./../tetris_sounds/SFX_PieceRotateFail.ogg").play();
                        }
                    }
                }
            }
            
        } else if(current_state == 1){
            for(i=0; i<18; i++){
                for(j=0; j<10;j++){
                    if(L[i][j] == 4 && L[i+1][j] == 4 && L[i+1][j-1] == 4 && L[i+2][j-1] == 4){
                        if(i < 16 && j > 1 && L[i+1][j-2] == 0 && L[i+2][j] == 0 && !gamePaused){
                            L[i+1][j-2] = 4
                            L[i+2][j] = 4

                            L[i][j] = 0
                            L[i+1][j] = 0

                            current_state = 0
                            new Audio("./../tetris_sounds/SFX_PieceRotateLR.ogg").play();
                        } else {
                            new Audio("./../tetris_sounds/SFX_PieceRotateFail.ogg").play();
                        }
                    }
                    
                }
            }
            
        } 
    }else if(current_form == "S"){
        if(current_state == 0){
            for(i=0; i<18; i++){
                for(j=0; j<10;j++){
                    if(L[i][j+1] == 5 && L[i][j+2] == 5 && L[i+1][j] == 5 && L[i+1][j+1] == 5){
                        if(i != 0 && i != 17 && j < 8 && L[i+1][j+2] == 0 && L[i-1][j+1] == 0 && !gamePaused){
                            L[i+1][j+2] = 5
                            L[i-1][j+1] = 5

                            L[i+1][j] = 0
                            L[i+1][j+1] = 0

                            current_state = 1
                            new Audio("./../tetris_sounds/SFX_PieceRotateLR.ogg").play();
                        } else {
                            new Audio("./../tetris_sounds/SFX_PieceRotateFail.ogg").play();
                        }
                    }
                }
            }
            
        } else if(current_state == 1){
            for(i=0; i<18; i++){
                for(j=0; j<10;j++){
                    if(L[i][j] == 5 && L[i+1][j] == 5 && L[i+1][j+1] == 5 && L[i+2][j+1] == 5){
                        if(i < 16 && j != 0 && L[i+2][j] == 0 && L[i+2][j-1] == 0 && !gamePaused){
                            L[i+2][j] = 5
                            L[i+2][j-1] = 5

                            L[i][j] = 0
                            L[i+2][j+1] = 0

                            current_state = 0
                            new Audio("./../tetris_sounds/SFX_PieceRotateLR.ogg").play();
                        } else {
                            new Audio("./../tetris_sounds/SFX_PieceRotateFail.ogg").play();
                        }
                    }
                    
                }
            }
           
        } 
    } else if(current_form == "T"){
        if(current_state == 0){
            for(i=0; i<18; i++){
                for(j=0; j<10;j++){
                    if(L[i][j] == 6 && L[i][j+1] == 6 && L[i][j+2] == 6 && L[i+1][j+1] == 6){
                        if(i != 0 && j < 8 && L[i-1][j+1] == 0 && !gamePaused){
                            L[i-1][j+1] = 6

                            L[i][j+2] = 0

                            current_state = 1
                            new Audio("./../tetris_sounds/SFX_PieceRotateLR.ogg").play();
                        } else {
                            new Audio("./../tetris_sounds/SFX_PieceRotateFail.ogg").play();
                        }
                    }
                }
            }
            
        } else if(current_state == 1){
            for(i=0; i<18; i++){
                for(j=0; j<10;j++){
                    if(L[i][j] == 6 && L[i-1][j+1] == 6 && L[i][j+1] == 6 && L[i+1][j+1] == 6){
                        if(i != 17 && j < 8 && L[i][j+2] == 0 && !gamePaused) {
                            L[i][j+2] = 6
                        
                            L[i+1][j+1] = 0

                            current_state = 2
                            new Audio("./../tetris_sounds/SFX_PieceRotateLR.ogg").play();
                        } else {
                            new Audio("./../tetris_sounds/SFX_PieceRotateFail.ogg").play();
                        }
                    }
                    
                }
            }
            
        } else if(current_state == 2){
            for(i=0; i<18; i++){
                for(j=0; j<10;j++){
                    if(L[i][j] == 6 && L[i][j+1] == 6 && L[i][j+2] == 6 && L[i-1][j+1] == 6){
                        if(i != 17 && j != 9 && L[i+1][j+1] == 0 && !gamePaused){
                            L[i+1][j+1] = 6
                       
                            L[i][j] = 0

                            current_state = 3
                            new Audio("./../tetris_sounds/SFX_PieceRotateLR.ogg").play();
                        } else {
                            new Audio("./../tetris_sounds/SFX_PieceRotateFail.ogg").play();
                        }
                    }
                    
                }
            }
            
        } else if(current_state == 3){
            for(i=0; i<18; i++){
                for(j=0; j<10;j++){
                    if(L[i][j] == 6 && L[i-1][j] == 6 && L[i+1][j] == 6 && L[i][j+1] == 6){
                        if(j != 0 && i!= 0 && L[i][j-1] == 0 && !gamePaused){
                            L[i][j-1] = 6
                            
                            L[i-1][j] = 0

                            current_state = 0
                            new Audio("./../tetris_sounds/SFX_PieceRotateLR.ogg").play();
                        } else {
                            new Audio("./../tetris_sounds/SFX_PieceRotateFail.ogg").play();
                        }
                    }
                    
                }
            }
            
        }

    }else if(current_form == "I"){
        if(current_state == 0){
            for(i=0; i<18; i++){
                for(j=0; j<10;j++){
                    if(L[i][j] == 7 && L[i][j+1] == 7 && L[i][j+2] == 7 && L[i][j+3] == 7){
                        if(i < 16 && j != 9 && L[i+1][j+1] == 0 && L[i+2][j+1] == 0 && L[i-1][j+1] == 0 && !gamePaused){
                            L[i+1][j+1] = 7
                            L[i+2][j+1] = 7
                            L[i-1][j+1] = 7

                            L[i][j] = 0
                            L[i][j+2] = 0
                            L[i][j+3] = 0

                            current_state = 1
                            new Audio("./../tetris_sounds/SFX_PieceRotateLR.ogg").play();
                        } else {
                            new Audio("./../tetris_sounds/SFX_PieceRotateFail.ogg").play();
                        }
                    }
                }
            }
            
        } else if(current_state == 1){
            for(i=0; i<18; i++){
                for(j=0; j<10;j++){
                    if(L[i][j] == 7 && L[i+1][j] == 7 && L[i+2][j] == 7 && L[i+3][j] == 7){
                        if(i != 17 && j != 0 && j < 8 && L[i+1][j-1] == 0 && L[i+1][j+1] == 0 && L[i+1][j+2] == 0 && !gamePaused){
                            L[i+1][j-1] = 7
                            L[i+1][j+1] = 7
                            L[i+1][j+2] = 7

                            L[i][j] = 0
                            L[i+2][j] = 0
                            L[i+3][j] = 0

                            current_state = 0
                            new Audio("./../tetris_sounds/SFX_PieceRotateLR.ogg").play();
                        } else {
                            new Audio("./../tetris_sounds/SFX_PieceRotateFail.ogg").play();
                        }

                    }
                    
                }
            }
            
        } 
    } else if(current_form == "O") {
        new Audio("./../tetris_sounds/SFX_PieceRotateLR.ogg").play();
    }
}








/* Ipad et Iphone */
document.addEventListener('swiped-left', function(e) {
    if(is_swiping == false){
    is_swiping = true
    first_id = e.target.id
    first_j = transform_with_id_to_j(first_id)

    second_id = document.elementFromPoint(e.detail.xEnd, e.detail.yEnd).id
    second_j = transform_with_id_to_j(second_id)

    swipe_left_right(array, first_j, second_j, "left")
    setTimeout(function(){is_swiping = false},100)}
  });


  document.addEventListener('swiped-right', function(e) {
    is_swiping = true
    first_id = e.target.id
    first_j = transform_with_id_to_j(first_id)

    second_id = document.elementFromPoint(e.detail.xEnd, e.detail.yEnd).id
    second_j = transform_with_id_to_j(second_id)

    swipe_left_right(array, first_j, second_j, "right")
    setTimeout(function(){is_swiping = false},100)
    
    
  });
  
  document.addEventListener('swiped-down', function() {
    is_swiping = true
    other_swipe(array, "down", current_form)
    is_swiping = false
    
  });
  
  document.addEventListener('click', function(e){
    if(e.target.classList[0] != "arrow" && e.target.classList[0] != "bi" && e.target.classList[0] != "show" && is_swiping == false && e.target.id != "pause") {
        other_swipe(array, "up", current_form)
    }   
  });



async function swipe_left_right(array, first_j, second_j, swipe_type){
    
    diff = Math.abs(parseInt(first_j)-parseInt(second_j))
    document.getElementById("swipe").innerText = diff + "," + first_j +"," + second_j
    for(index=0;index<diff; index++){
        document.getElementById("swipe").innerText = index
        if(swipe_type == "left"){
            check_left(array)
        } else if(swipe_type == "right"){
            check_right(array)
        } 
        show(array)
        color(swipe_type);
        await sleep(50)
    }return_color(swipe_type);
}

async function other_swipe(array, swipe_type, current_form){
    if(swipe_type == "down"){
        time = 10
        show(array)
        color(swipe_type);
        await sleep(500)
    } else {
        turn(array, current_form);
        color(swipe_type);
        show(array);
        await sleep(50)
    } 
    return_color(swipe_type)
}