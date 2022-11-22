/* Ce qu'il reste à faire:
    - Gérer le cas des deux joueurs
    - Gérer le cas de l'échec
    - Gérer le cas de l'échec et mat
    - Gérer le cas de la conversion du pion en piece du choix du joueur
    - Gérer l'affichage des pièces mangées


*/
function bool_eat(nb, id){
    return document.getElementById(id+nb).classList[2] == "black_piece" && document.getElementById(id).classList[2] == "white_piece" || document.getElementById(id).classList[2] == "black_piece" && document.getElementById(id+nb).classList[2] == "white_piece"
}

function play(id){
    empty_cell = document.getElementById(id).querySelector("span").classList
    a = document.getElementsByClassName(empty_cell[3])
    // We choose what piece is the one that we want to delete between the same ones.
    for(i=0; i < a.length; i++){
        if(a[i].id == empty_cell[4]){
            a[i].classList.remove(empty_cell[2], empty_cell[3])
            break
        }
    }
    document.getElementById(id).classList.add(empty_cell[2], empty_cell[3])
}

function eat(classes, id){
    empty_cell = document.getElementById(id).querySelector("span").classList
    a = document.getElementsByClassName(empty_cell[3])
    // We choose what piece is the one that we want to delete between the same ones.
    document.getElementById(id).classList.remove(classes[2], classes[3])
    for(i=0; i < a.length; i++){
        if(a[i].id == empty_cell[4]){
            a[i].classList.remove(empty_cell[2], empty_cell[3])
            break
        }
    }
    document.getElementById(id).classList.add(empty_cell[2], empty_cell[3])
}

setTimeout(function(){
eq = document.getElementById("echequier")
let cpt = 0
for(i=0; i<8; i++){
    for(j=0; j<8;j++){
        if((i+j) % 2 == 0){
            cell = document.createElement("button")
            cell.className = "cell whitecell"
        } else{
            cell = document.createElement("button")
            cell.className = "cell blackcell"
        }
        if(i == 1) {
            cell.classList.add("black_piece")
            cell.classList.add("black_pawn")
        }else if(i == 6){
            cell.classList.add("white_piece")
            cell.classList.add("white_pawn")
        } else if(i == 0){
            cell.classList.add("black_piece")
            if((j == 0 || j == 7)){
                cell.classList.add("black_rock")
            } else if(j == 1 || j == 6){
                cell.classList.add("black_knight")
            } else if(j == 2 || j == 5){
                cell.classList.add("black_bishop")
            } else if(j == 3){
                cell.classList.add("black_queen")
            } else{
                cell.classList.add("black_king")
            }
        } else if(i == 7){
            cell.classList.add("white_piece")
            if((j == 0 || j == 7)){
                cell.classList.add("white_rock")
            } else if(j == 1 || j == 6){
                cell.classList.add("white_knight")
            } else if(j == 2 || j == 5){
                cell.classList.add("white_bishop")
            } else if(j == 3){
                cell.classList.add("white_queen")
            } else{
                cell.classList.add("white_king")
            }
        }
        cell.id = cpt
        eq.appendChild(cell)
        hint = document.createElement("span")
        hint.className = "hint"
        cell.appendChild(hint)
        cpt++;

    }
}

window.onclick = function(e) {
    array1 = e.path
    if(array1[0].classList[0] == "hint"){
        array1.shift();
    }
    console.log(array1[0].classList, parseInt(array1[0].id))
    console.log(array1)
    click(array1[0].classList, parseInt(array1[0].id))
}


function click(classes, id){
    eat_or_move = false
    if(document.getElementById(id).querySelector("span").classList.length > 1){
        if(document.getElementById(id).querySelector("span").classList[1] == "show"){
            play(id)
            
        } else{
            eat(classes, id)
        } eat_or_move = true
        
    }

    y = document.getElementsByClassName("show")
    x = document.getElementsByClassName("active")
    if (y.length > 0){
        for(i = y.length-1; i > -1; i-- ){
            document.getElementsByClassName("show")[i].setAttribute("class", "hint");
        }
    }
    if (x.length > 0){
        for(j = x.length-1; j > -1; j-- ){
            document.getElementsByClassName("active")[j].setAttribute("class", "hint");
        }
    }
    


    if((classes[2] == "black_piece" || classes[2] == "white_piece") && eat_or_move == false){
        if(classes[3] == "white_king" || classes[3] == "black_king"){
            if(0 <= id+1 && id+1 <= 63 && (Math.floor((id+1)/8) == Math.floor(id/8))){
                if(document.getElementById(id+1).classList.length < 3){
                    document.getElementById(id+1).querySelector("span").classList.add("show", classes[2] ,classes[3], id)
                } else if(bool_eat(1, id)){
                    document.getElementById(id+1).querySelector("span").classList.add("active", classes[2],classes[3], id)
                }
            }
            if(0 <= id-1 && id-1 <= 63 && (Math.floor((id-1)/8) == Math.floor(id/8))){
                if(document.getElementById(id-1).classList.length < 3){
                    document.getElementById(id-1).querySelector("span").classList.add("show", classes[2],classes[3], id)
                } else if(bool_eat(-1, id)){
                    document.getElementById(id-1).querySelector("span").classList.add("active", classes[2],classes[3], id)
                }
            }
            if(0 <= id+8 && id+8 <= 63 && (Math.floor((id+8)/8) == Math.floor(id/8)+1)){
                if(document.getElementById(id+8).classList.length < 3){
                    document.getElementById(id+8).querySelector("span").classList.add("show", classes[2],classes[3], id)
                }else if(bool_eat(8, id)){
                    document.getElementById(id+8).querySelector("span").classList.add("active", classes[2],classes[3], id)
                }
            }
            if(0 <= id-8 && id-8 <= 63 && (Math.floor((id-8)/8) == Math.floor(id/8)-1)){
                if(document.getElementById(id-8).classList.length < 3){
                    document.getElementById(id-8).querySelector("span").classList.add("show", classes[2],classes[3], id)
                } else if(bool_eat(-8, id)){
                    document.getElementById(id-8).querySelector("span").classList.add("active", classes[2],classes[3], id)
                }
            } if(0 <= id+7 && id+7 <= 63 && (Math.floor((id+7)/8) == Math.floor(id/8)+1)){
                if(document.getElementById(id+7).classList.length < 3){
                    document.getElementById(id+7).querySelector("span").classList.add("show", classes[2],classes[3], id)
                } else if(bool_eat(7, id)){
                    document.getElementById(id+7).querySelector("span").classList.add("active", classes[2],classes[3], id)
                }
            }
            if(0 <= id-7 && id-7 <= 63 && (Math.floor((id-7)/8) == Math.floor(id/8)-1)){
                if(document.getElementById(id-7).classList.length < 3){
                    document.getElementById(id-7).querySelector("span").classList.add("show", classes[2],classes[3], id)
                } else if(bool_eat(-7, id)){
                    document.getElementById(id-7).querySelector("span").classList.add("active", classes[2],classes[3], id)
                }
            }
            if(0 <= id+9 && id+9 <= 63 && (Math.floor((id+9)/8) == Math.floor(id/8)+1)){
                if(document.getElementById(id+9).classList.length < 3){
                    document.getElementById(id+9).querySelector("span").classList.add("show", classes[2],classes[3], id)
                } else if(bool_eat(9, id)){
                    document.getElementById(id+9).querySelector("span").classList.add("active", classes[2],classes[3], id)
                }
            }
            if(0 <= id-9 && id-9 <= 63 && (Math.floor((id-8)/8) == Math.floor(id/8)-1)){
                if(document.getElementById(id-9).classList.length < 3){
                    document.getElementById(id-9).querySelector("span").classList.add("show", classes[2],classes[3], id)
                } else if(bool_eat(-9, id)){
                    document.getElementById(id-9).querySelector("span").classList.add("active", classes[2],classes[3], id)
                }
            }
    
        } else if(classes[3] == "white_pawn"){
            if(Math.floor((id-7)/8) == Math.floor(id/8)-1){
                if(bool_eat(-7, id)){
                    document.getElementById(id-7).querySelector("span").classList.add("active", classes[2],classes[3], id)
                } 
            }
            if(Math.floor((id-9)/8) == Math.floor(id/8)-1){
                if (bool_eat(-9, id)){
                    document.getElementById(id-9).querySelector("span").classList.add("active", classes[2],classes[3], id)
                }  
            }
            
            if(id >= 48 && document.getElementById(id-8).classList.length < 3 && document.getElementById(id-16).classList.length < 3){
                document.getElementById(id-8).querySelector("span").classList.add("show", classes[2],classes[3], id)
                document.getElementById(id-16).querySelector("span").classList.add("show", classes[2],classes[3], id)
            }
            
            
            else if(0 <= id-8){
                if(document.getElementById(id-8).classList.length < 3){
                    document.getElementById(id-8).querySelector("span").classList.add("show", classes[2],classes[3], id)
                } 
            }
        } else if(classes[3] == "black_pawn"){
            if(Math.floor((id+7)/8) == Math.floor(id/8)+1){
                if(bool_eat(7, id)){
                    document.getElementById(id+7).querySelector("span").classList.add("active", classes[2],classes[3], id)
                } 
            }
            if(Math.floor((id+9)/8) == Math.floor(id/8)+1){
                if (bool_eat(9, id)){
                    document.getElementById(id+9).querySelector("span").classList.add("active", classes[2],classes[3], id)
                }  
            }
            
            
            if(id <= 15 && document.getElementById(id+8).classList.length < 3 && document.getElementById(id+16).classList.length < 3){
                document.getElementById(id+8).querySelector("span").classList.add("show", classes[2],classes[3], id)
                document.getElementById(id+16).querySelector("span").classList.add("show", classes[2],classes[3], id)
            }
            
            
            else if(id+8 <= 63){
                if(document.getElementById(id+8).classList.length < 3){
                    document.getElementById(id+8).querySelector("span").classList.add("show", classes[2],classes[3], id)
                }
            }


        }else if(classes[3] == "white_knight" || classes[3] == "black_knight"){
            /* Gérer le eat*/
            if(0 <= id+10 && id+10 <= 63 && Math.floor((id+11)/ 8) == Math.floor(id/8)+1){
                if(document.getElementById(id+10).classList.length < 3){
                    document.getElementById(id+10).querySelector("span").classList.add("show", classes[2],classes[3], id)
                } else if(bool_eat(+10, id)){
                    document.getElementById(id+10).querySelector("span").classList.add("active", classes[2],classes[3], id)
                }
            }
            if(0 <= id-10 && id-10 <= 63 && (Math.floor((id-10)/ 8) == Math.floor(id/8)-1)){
                if(document.getElementById(id-10).classList.length < 3){
                    document.getElementById(id-10).querySelector("span").classList.add("show", classes[2],classes[3], id)
                } else if(bool_eat(-10, id)){
                    document.getElementById(id-10).querySelector("span").classList.add("active", classes[2],classes[3], id)
                }
            }
            if(0 <= id+6 && id+6 <= 63 && (Math.floor((id+6)/ 8) == Math.floor(id/8)+1)){
                if(document.getElementById(id+6).classList.length < 3){
                    document.getElementById(id+6).querySelector("span").classList.add("show", classes[2],classes[3], id)
                } else if(bool_eat(+6, id)){
                    document.getElementById(id+6).querySelector("span").classList.add("active", classes[2],classes[3], id)
                }
            }
            if(0 <= id-6 && id-6 <= 63 && (Math.floor((id-6)/ 8) == Math.floor(id/8)-1)){
                if(document.getElementById(id-6).classList.length < 3){
                    document.getElementById(id-6).querySelector("span").classList.add("show", classes[2],classes[3], id)
                } else if(bool_eat(-6, id)){
                    document.getElementById(id-6).querySelector("span").classList.add("active", classes[2],classes[3], id)
                }
            } if(0 <= id+15 && id+15 <= 63 && (Math.floor((id+15)/ 8) == Math.floor(id/8)+2)){
                if(document.getElementById(id+15).classList.length < 3){
                    document.getElementById(id+15).querySelector("span").classList.add("show", classes[2],classes[3], id)
                } else if(bool_eat(+15, id)){
                    document.getElementById(id+15).querySelector("span").classList.add("active", classes[2],classes[3], id)
                }
            }
            if(0 <= id-15 && id-15 <= 63 && (Math.floor((id-15)/ 8) == Math.floor(id/8)-2)){
                if(document.getElementById(id-15).classList.length < 3){
                    document.getElementById(id-15).querySelector("span").classList.add("show", classes[2],classes[3], id)
                } else if(bool_eat(-15, id)){
                    document.getElementById(id-15).querySelector("span").classList.add("active", classes[2],classes[3], id)
                }
            } if(0 <= id+17 && id+17 <= 63 && (Math.floor((id+17)/ 8) == Math.floor(id/8)+2)){
                if(document.getElementById(id+17).classList.length < 3){
                    document.getElementById(id+17).querySelector("span").classList.add("show", classes[2],classes[3], id)
                } else if(bool_eat(+17, id)){
                    document.getElementById(id+17).querySelector("span").classList.add("active", classes[2],classes[3], id)
                }
            }
            if(0 <= id-17 && id-17 <= 63 && (Math.floor((id-17)/ 8) == Math.floor(id/8)-2)){
                if(document.getElementById(id-17).classList.length < 3){
                    document.getElementById(id-17).querySelector("span").classList.add("show", classes[2],classes[3], id)
                } else if(bool_eat(-17, id)){
                    document.getElementById(id-17).querySelector("span").classList.add("active", classes[2],classes[3], id)
                }
            }
    
        } else if(classes[3] == "white_bishop" || classes[3] == "black_bishop" || classes[3] == "white_queen" || classes[3] == "black_queen"){
            cpt_h_d = 7
            
            while(0 <= id - cpt_h_d && document.getElementById(id-cpt_h_d).classList.length == 2 && (Math.floor((id-cpt_h_d)/ 8) == Math.floor(id/8)-(cpt_h_d/7))){
                document.getElementById(id-cpt_h_d).querySelector("span").classList.add("show", classes[2],classes[3], id)
                cpt_h_d = cpt_h_d + 7;
                
            }
            if((id-cpt_h_d >= 0) && (Math.floor((id-cpt_h_d)/ 8) == Math.floor(id/8)-(cpt_h_d/7)) && bool_eat(-cpt_h_d, id)){
                document.getElementById(id-cpt_h_d).querySelector("span").classList.add("active", classes[2],classes[3], id)

            }
            cpt_h_g = 9
            while(0 <= id-cpt_h_g && document.getElementById(id-cpt_h_g).classList.length == 2 && (Math.floor((id-cpt_h_g)/ 8) == Math.floor(id/8)-(cpt_h_g/9))){
                document.getElementById(id-cpt_h_g).querySelector("span").classList.add("show", classes[2],classes[3], id)
                cpt_h_g = cpt_h_g + 9;
            } if((id-cpt_h_g >= 0) && (Math.floor((id-cpt_h_g)/ 8) == Math.floor(id/8)-(cpt_h_g/9)) && bool_eat(-cpt_h_g, id)){
                document.getElementById(id-cpt_h_g).querySelector("span").classList.add("active", classes[2],classes[3], id)

            }
            cpt_b_d = 9
            while(id + cpt_b_d <= 63 && document.getElementById(id+cpt_b_d).classList.length == 2 && (Math.floor((id+cpt_b_d)/ 8) == Math.floor(id/8)+(cpt_b_d/9))){
                document.getElementById(id+cpt_b_d).querySelector("span").classList.add("show", classes[2],classes[3], id)
                cpt_b_d = cpt_b_d + 9;
            } if((id+cpt_b_d <= 63) && (Math.floor((id+cpt_b_d)/ 8) == Math.floor(id/8)+(cpt_b_d/9)) && bool_eat(cpt_b_d, id)){
                document.getElementById(id+cpt_b_d).querySelector("span").classList.add("active", classes[2],classes[3], id)

            }
            cpt_b_g  = 7
            while(id + cpt_b_g <= 63 && document.getElementById(id+cpt_b_g).classList.length == 2 && (Math.floor((id+cpt_b_g)/ 8) == Math.floor(id/8)+(cpt_b_g/7))){
                document.getElementById(id+cpt_b_g).querySelector("span").classList.add("show", classes[2],classes[3], id)
                cpt_b_g = cpt_b_g + 7;
            }if((id+cpt_b_g <= 63) && (Math.floor((id+cpt_b_g)/ 8) == Math.floor(id/8)+(cpt_b_g/7)) && bool_eat(cpt_b_g, id)){
                document.getElementById(id+cpt_b_g).querySelector("span").classList.add("active", classes[2],classes[3], id)

            }


        } if(classes[3] == "white_rock" || classes[3] == "black_rock" || classes[3] == "white_queen" || classes[3] == "black_queen"){
            cpt_h = 8
            
            while(0 <= id - cpt_h && document.getElementById(id-cpt_h).classList.length == 2 && (Math.floor((id-cpt_h)/ 8) == Math.floor(id/8)-(cpt_h/8))){
                document.getElementById(id-cpt_h).querySelector("span").classList.add("show", classes[2],classes[3], id)
                cpt_h = cpt_h + 8;

            } if(0 <= id - cpt_h && (Math.floor((id-cpt_h)/ 8) == Math.floor(id/8)-(cpt_h/8)) && bool_eat(-cpt_h, id)){
                document.getElementById(id-cpt_h).querySelector("span").classList.add("active", classes[2],classes[3], id)
            }

            cpt_g = 1
            while(0 <= id-cpt_g && document.getElementById(id-cpt_g).classList.length == 2 && (Math.floor((id-cpt_g)/ 8) == Math.floor(id/8))){
                document.getElementById(id-cpt_g).querySelector("span").classList.add("show", classes[2],classes[3], id)
                cpt_g = cpt_g + 1;
            } if(0 <= id - cpt_g && (Math.floor((id-cpt_g)/ 8) == Math.floor(id/8)) && bool_eat(-cpt_g, id)){
                document.getElementById(id-cpt_g).querySelector("span").classList.add("active", classes[2],classes[3], id)
            }

            cpt_d = 1
            while(id + cpt_d <= 63 && document.getElementById(id+cpt_d).classList.length == 2 && (Math.floor((id+cpt_d)/ 8) == Math.floor(id/8))){
                document.getElementById(id+cpt_d).querySelector("span").classList.add("show", classes[2],classes[3], id)
                cpt_d = cpt_d + 1;
            } if(id + cpt_d <= 63 && (Math.floor((id+cpt_d)/ 8) == Math.floor(id/8)) && bool_eat(cpt_d, id)){
                document.getElementById(id+cpt_d).querySelector("span").classList.add("active", classes[2],classes[3], id)
            }

            cpt_b  = 8
            while(id + cpt_b <= 63 && document.getElementById(id+cpt_b).classList.length == 2 && (Math.floor((id+cpt_b)/ 8) == Math.floor(id/8)+(cpt_b/8))){
                document.getElementById(id+cpt_b).querySelector("span").classList.add("show", classes[2],classes[3], id)
                cpt_b = cpt_b + 8;
            } if(id + cpt_b <= 63 && (Math.floor((id+cpt_b)/ 8) == Math.floor(id/8)+(cpt_b/8)) && bool_eat(cpt_b, id)){
                document.getElementById(id+cpt_b).querySelector("span").classList.add("active", classes[2],classes[3], id)
            }
        }
    }
    

}

}, 10)
