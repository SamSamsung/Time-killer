/* Travail réstant :
 FAIT : - Corriger le bug de la brick qui ne veut pas descendre -> Très dur
 FAIT : - Gérer le cas de la border male faite -> Chiant
 FAIT : - Rendre le jeu un peu plus esthétique -> Simple
 - Gérer la défaite -> Très simple
- Rajouter un icone à la page -> Très simple
- Emepêcher de tourner sous certaines conditions -> Simple
- Centrer les bricks dans le next move -> Simple
- Rajouter le son -> Très simple
- Gérer le score -> Chiant, Bof, trop galère, grosse flemme pour l'instant
FAIT : - Gérer le cas des niveaux et de l'accélération
- Rajouter le pause -> Dur
FAIT : - Gérer les boutons -> Gérer le hold
*/

var array = []
var next = []
var colors = ["green", "orange", "red", "cyan", "yellow", "blue", "purple"]
var forms = ["L", "J", "O", "Z", "S", "T", "I"]

var form = forms[random(forms.length)];

var current_form = forms[random(forms.length)];

var current_state = 0;

var score_lines = 0;
var level = 1;
var time = 500 * (0.85 ** (level - 1));

var DIC = {1 : "L", 2 : "J", 3 : "O", 4 : "Z", 5 : "S", 6 : "T", 7 : "I"}
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
    construct(next, 2, 0, form)
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
}

function checks_lost(L){
    for(j=0; j<10;j++){
        if(L[2][j] == 8){
            return true
        }
    }
    return false
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
        remove_lines(L, lines);
    }
}

function remove_lines(L, lines){
    for(i of lines){
        console.log(i, lines)
        for(j=0; j<10;j++){
            L[i][j] = 0
        }/*bring_down_line(L, i)*/
    }
    bring_down(L, lines)
    
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
    level = 1 + Math.floor(score_lines / 10);
    document.getElementById("lines").innerHTML = score_lines
    document.getElementById("level").innerHTML = level
    time = 500 * (0.85 ** (level - 1));
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}



/* Main loop */
async function speed(array){
    play = true
    while(play==true){
        await sleep(time)
        check_end(array)
        move(array)
        checks_win(array)
        if(checks_lost(array) == true){
            play = false
            alert("you have lost")
        }
        show(array)
        
    }
}

/* Starting code */
setTimeout(function(){
    init()
    init_next()
    show(array)
    construct(array, 1, 4, current_form)
    next_move(next, form) 
    
    show(array)
    speed(array)
    arrows()
    
}, 100);


function arrows(){
    document.getElementById("arrow-left").onmousedown = function() {
        repeat_left = setInterval(function(){
            check_left(array)
            show(array)
            color("left");
        }, 100)
    };
    document.getElementById("arrow-right").onmousedown = function() {
        repeat_right = setInterval(function(){ 
            check_right(array)
            show(array)
            color("right");
        }, 100)
    };
    document.getElementById("arrow-up").onmousedown = function() {
        repeat_up = setInterval(function(){ 
            turn(array, current_form) 
            show(array)
            color("up");
        }, 100)
    };
    document.getElementById("arrow-down").onmousedown = function() {
        repeat_down = setInterval(function(){ 
            time = 40
            color("down");
    }, 100)
    };
    
    
    document.getElementById("arrow-down").onmouseup = function() {
        clearInterval(repeat_down)
        time = 500 * (0.8 ** (level - 1))
        return_color("down");
    };
    document.getElementById("arrow-left").onmouseup = function() {
        clearInterval(repeat_left)
        return_color("left");
    };
    document.getElementById("arrow-right").onmouseup = function() {
        clearInterval(repeat_right)
        return_color("right");
    };
    document.getElementById("arrow-up").onmouseup = function() {
        clearInterval(repeat_up)
        return_color("up");
    };

    document.getElementById("arrow-down").onmouseleave = function() {
        clearInterval(repeat_down)
        time = 500 * (0.8 ** (level - 1))
        return_color("down");
    };
    document.getElementById("arrow-left").onmouseleave = function() {
        clearInterval(repeat_left)
        return_color("left");
    };
    document.getElementById("arrow-right").onmouseleave = function() {
        clearInterval(repeat_right)
        return_color("right");
    };
    document.getElementById("arrow-up").onmouseleave = function() {
        clearInterval(repeat_up)
        return_color("up");
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
    }if(can_right == true){
        right(L)
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
    }if(can_left == true){
        left(L)
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
                        L[i-1][j] = 1
                        L[i-1][j+1] = 1
                        L[i+1][j+1] = 1

                        L[i][j] = 0
                        L[i][j+2] = 0
                        L[i+1][j] = 0
                    }
                }
            }
            current_state = 1
        } else if(current_state == 1){
            for(i=0; i<18; i++){
                for(j=0; j<10;j++){
                    if(L[i][j] == 1 && L[i][j+1] == 1 && L[i+1][j+1] == 1 && L[i+2][j+1] == 1){
                        L[i][j+2] = 1
                        L[i+1][j+2] = 1
                        L[i+1][j] = 1

                        L[i][j] = 0
                        L[i][j+1] = 0
                        L[i+2][j+1] = 0
                    }
                    
                }
            }
            current_state = 2
        } else if(current_state == 2){
            for(i=0; i<18; i++){
                for(j=0; j<10;j++){
                    if(L[i][j] == 1 && L[i+1][j] == 1 && L[i+1][j-1] == 1 && L[i+1][j-2] == 1){
                        L[i][j-1] = 1
                        L[i+2][j-1] = 1
                        L[i+2][j] = 1

                        L[i][j] = 0
                        L[i+1][j] = 0
                        L[i+1][j-2] = 0
                    }
                    
                }
            }
            current_state = 3
        } else if(current_state == 3){
            for(i=0; i<18; i++){
                for(j=0; j<10;j++){
                    if(L[i][j] == 1 && L[i+1][j] == 1 && L[i+2][j] == 1 && L[i+2][j+1] == 1){
                        L[i+2][j-1] = 1
                        L[i+1][j-1] = 1
                        L[i+1][j+1] = 1

                        L[i][j] = 0
                        L[i+2][j] = 0
                        L[i+2][j+1] = 0
                    }
                    
                }
            }
            current_state = 0
        }
    }else if(current_form == "J"){
        if(current_state == 0){
            for(i=0; i<18; i++){
                for(j=0; j<10;j++){
                    if(L[i][j] == 2 && L[i][j+1] == 2 && L[i][j+2] == 2 && L[i+1][j+2] == 2){
                        L[i+1][j] = 2
                        L[i+1][j+1] = 2
                        L[i-1][j+1] = 2

                        L[i][j] = 0
                        L[i][j+2] = 0
                        L[i+1][j+2] = 0
                    }
                }
            }
            current_state = 1
        } else if(current_state == 1){
            for(i=0; i<18; i++){
                for(j=0; j<10;j++){
                    if(L[i][j] == 2 && L[i+1][j] == 2 && L[i+2][j] == 2 && L[i+2][j-1] == 2){
                        L[i][j-1] = 2
                        L[i+1][j-1] = 2
                        L[i+1][j+1] = 2

                        L[i][j] = 0
                        L[i+2][j] = 0
                        L[i+2][j-1] = 0
                    }
                    
                }
            }
            current_state = 2
        } else if(current_state == 2){
            for(i=0; i<18; i++){
                for(j=0; j<10;j++){
                    if(L[i][j] == 2 && L[i+1][j] == 2 && L[i+1][j+1] == 2 && L[i+1][j+2] == 2){
                        L[i][j+1] = 2
                        L[i][j+2] = 2
                        L[i+2][j+1] = 2

                        L[i][j] = 0
                        L[i+1][j] = 0
                        L[i+1][j+2] = 0
                    }
                    
                }
            }
            current_state = 3
        } else if(current_state == 3){
            for(i=0; i<18; i++){
                for(j=0; j<10;j++){
                    if(L[i][j] == 2 && L[i+1][j] == 2 && L[i+2][j] == 2 && L[i][j+1] == 2){
                        L[i+1][j-1] = 2
                        L[i+2][j+1] = 2
                        L[i+1][j+1] = 2

                        L[i][j] = 0
                        L[i][j+1] = 0
                        L[i+2][j] = 0
                    }
                    
                }
            }
            current_state = 0
        }

    }else if(current_form == "Z"){
        if(current_state == 0){
            for(i=0; i<18; i++){
                for(j=0; j<10;j++){
                    if(L[i][j] == 4 && L[i][j+1] == 4 && L[i+1][j+1] == 4 && L[i+1][j+2] == 4){
                        L[i][j+2] = 4
                        L[i-1][j+2] = 4

                        L[i][j] = 0
                        L[i+1][j+2] = 0
                    }
                }
            }
            current_state = 1
        } else if(current_state == 1){
            for(i=0; i<18; i++){
                for(j=0; j<10;j++){
                    if(L[i][j] == 4 && L[i+1][j] == 4 && L[i+1][j-1] == 4 && L[i+2][j-1] == 4){
                        L[i+1][j-2] = 4
                        L[i+2][j] = 4

                        L[i][j] = 0
                        L[i+1][j] = 0
                    }
                    
                }
            }
            current_state = 0
        } 
    }else if(current_form == "S"){
        if(current_state == 0){
            for(i=0; i<18; i++){
                for(j=0; j<10;j++){
                    if(L[i][j+1] == 5 && L[i][j+2] == 5 && L[i+1][j] == 5 && L[i+1][j+1] == 5){
                        L[i+1][j+2] = 5
                        L[i-1][j+1] = 5

                        L[i+1][j] = 0
                        L[i+1][j+1] = 0
                    }
                }
            }
            current_state = 1
        } else if(current_state == 1){
            for(i=0; i<18; i++){
                for(j=0; j<10;j++){
                    if(L[i][j] == 5 && L[i+1][j] == 5 && L[i+1][j+1] == 5 && L[i+2][j+1] == 5){
                        L[i+2][j] = 5
                        L[i+2][j-1] = 5

                        L[i][j] = 0
                        L[i+2][j+1] = 0
                    }
                    
                }
            }
            current_state = 0
        } 
    } else if(current_form == "T"){
        if(current_state == 0){
            for(i=0; i<18; i++){
                for(j=0; j<10;j++){
                    if(L[i][j] == 6 && L[i][j+1] == 6 && L[i][j+2] == 6 && L[i+1][j+1] == 6){
                        L[i-1][j+1] = 6

                        L[i][j+2] = 0
                    }
                }
            }
            current_state = 1
        } else if(current_state == 1){
            for(i=0; i<18; i++){
                for(j=0; j<10;j++){
                    if(L[i][j] == 6 && L[i-1][j+1] == 6 && L[i][j+1] == 6 && L[i+1][j+1] == 6){
                        L[i][j+2] = 6
                        
                        L[i+1][j+1] = 0
                    }
                    
                }
            }
            current_state = 2
        } else if(current_state == 2){
            for(i=0; i<18; i++){
                for(j=0; j<10;j++){
                    if(L[i][j] == 6 && L[i][j+1] == 6 && L[i][j+2] == 6 && L[i-1][j+1] == 6){
                        L[i+1][j+1] = 6
                       
                        L[i][j] = 0
                    }
                    
                }
            }
            current_state = 3
        } else if(current_state == 3){
            for(i=0; i<18; i++){
                for(j=0; j<10;j++){
                    if(L[i][j] == 6 && L[i-1][j] == 6 && L[i+1][j] == 6 && L[i][j+1] == 6){
                        L[i][j-1] = 6
                        
                        L[i-1][j] = 0
                    }
                    
                }
            }
            current_state = 0
        }

    }else if(current_form == "I"){
        if(current_state == 0){
            for(i=0; i<18; i++){
                for(j=0; j<10;j++){
                    if(L[i][j] == 7 && L[i][j+1] == 7 && L[i][j+2] == 7 && L[i][j+3] == 7){
                        L[i+1][j+1] = 7
                        L[i+2][j+1] = 7
                        L[i-1][j+1] = 7

                        L[i][j] = 0
                        L[i][j+2] = 0
                        L[i][j+3] = 0
                    }
                }
            }
            current_state = 1
        } else if(current_state == 1){
            for(i=0; i<18; i++){
                for(j=0; j<10;j++){
                    if(L[i][j] == 7 && L[i+1][j] == 7 && L[i+2][j] == 7 && L[i+3][j] == 7){
                        L[i+1][j-1] = 7
                        L[i+1][j+1] = 7
                        L[i+1][j+2] = 7

                        L[i][j] = 0
                        L[i+2][j] = 0
                        L[i+3][j] = 0
                    }
                    
                }
            }
            current_state = 0
        } 
    }
}