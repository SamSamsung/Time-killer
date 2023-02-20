/* Ce qu'il reste à faire:
    - Gérer le cas des pièces ne pouvant qu'aider le roi lors de l'échec (presque fini -> compliqué)
    - Gérer le cas du clouage (très compliqué)
    - Gérer le cas de l'échec et mat (compliqué)
    - Gérer le cas de la conversion du pion en piece du choix du joueur (simple)
    - Gérer l'affichage des pièces mangées (simple)


*/

function all_moves_and_eat(classes, id, other_eat, predict_move="show"){
    if((classes[2] == "black_piece" || classes[2] == "white_piece") && eat_or_move == false){
        if(classes[3] == "white_king" || classes[3] == "black_king"){
            // Ce sera similaire pour toutes les pièces
            // On vérifie que le mouvement ne sort pas de l'échequier
            // On vérifie que le mouvement est sur la bonne ligne (si la pièce est collée a droite, elle ne peut pas bouger a gauche.)
            if(0 <= id+1 && id+1 <= 63 && (Math.floor((id+1)/8) == Math.floor(id/8))){
                if(document.getElementById(id+1).classList.length < 3  && bool_play_when_chess(1, id)){
                    document.getElementById(id+1).querySelector("span").classList.add(predict_move, classes[2] ,classes[3], id)
                } else if(bool_eat(1, id)){
                    document.getElementById(id+1).querySelector("span")
                }
            }
            if(0 <= id-1 && id-1 <= 63 && (Math.floor((id-1)/8) == Math.floor(id/8))){
                if(document.getElementById(id-1).classList.length < 3  && bool_play_when_chess(-1, id)){
                    document.getElementById(id-1).querySelector("span").classList.add(predict_move, classes[2],classes[3], id)
                } else if(bool_eat(-1, id)){
                    document.getElementById(id-1).querySelector("span").classList.add(other_eat, classes[2],classes[3], id)
                }
            }
            if(0 <= id+8 && id+8 <= 63 && (Math.floor((id+8)/8) == Math.floor(id/8)+1) ){
                if(document.getElementById(id+8).classList.length < 3 && bool_play_when_chess(8, id)){
                    document.getElementById(id+8).querySelector("span").classList.add(predict_move, classes[2],classes[3], id)
                }else if(bool_eat(8, id)){
                    document.getElementById(id+8).querySelector("span").classList.add(other_eat, classes[2],classes[3], id)
                }
            }
            if(0 <= id-8 && id-8 <= 63 && (Math.floor((id-8)/8) == Math.floor(id/8)-1)){
                if(document.getElementById(id-8).classList.length < 3 && bool_play_when_chess(-8, id)){
                    document.getElementById(id-8).querySelector("span").classList.add(predict_move, classes[2],classes[3], id)
                } else if(bool_eat(-8, id)){
                    document.getElementById(id-8).querySelector("span").classList.add(other_eat, classes[2],classes[3], id)
                }
            } if(0 <= id+7 && id+7 <= 63 && (Math.floor((id+7)/8) == Math.floor(id/8)+1)){
                if(document.getElementById(id+7).classList.length < 3 && bool_play_when_chess(7, id)){
                    document.getElementById(id+7).querySelector("span").classList.add(predict_move, classes[2],classes[3], id)
                } else if(bool_eat(7, id)){
                    document.getElementById(id+7).querySelector("span").classList.add(other_eat, classes[2],classes[3], id)
                }
            }
            if(0 <= id-7 && id-7 <= 63 && (Math.floor((id-7)/8) == Math.floor(id/8)-1)){
                if(document.getElementById(id-7).classList.length < 3 && bool_play_when_chess(-7, id)){
                    document.getElementById(id-7).querySelector("span").classList.add(predict_move, classes[2],classes[3], id)
                } else if(bool_eat(-7, id)){
                    document.getElementById(id-7).querySelector("span").classList.add(other_eat, classes[2],classes[3], id)
                }
            }
            if(0 <= id+9 && id+9 <= 63 && (Math.floor((id+9)/8) == Math.floor(id/8)+1)){
                if(document.getElementById(id+9).classList.length < 3 && bool_play_when_chess(9, id)){
                    document.getElementById(id+9).querySelector("span").classList.add(predict_move, classes[2],classes[3], id)
                } else if(bool_eat(9, id)){
                    document.getElementById(id+9).querySelector("span").classList.add(other_eat, classes[2],classes[3], id)
                }
            }
            if(0 <= id-9 && id-9 <= 63 && (Math.floor((id-8)/8) == Math.floor(id/8)-1)){
                if(document.getElementById(id-9).classList.length < 3 && bool_play_when_chess(-9, id)){
                    document.getElementById(id-9).querySelector("span").classList.add(predict_move, classes[2],classes[3], id)
                } else if(bool_eat(-9, id)){
                    document.getElementById(id-9).querySelector("span").classList.add(other_eat, classes[2],classes[3], id)
                }
            }
    
        } else if(classes[3] == "white_pawn"){
            
            if(Math.floor((id-7)/8) == Math.floor(id/8)-1 && bool_play_when_chess(-7, id)){
                if(bool_eat(-7, id)){
                    document.getElementById(id-7).querySelector("span").classList.add(other_eat, classes[2],classes[3], id)
                    
                } 
            }
            if(Math.floor((id-9)/8) == Math.floor(id/8)-1 && bool_play_when_chess(-9, id)){
                if (bool_eat(-9, id)){
                    document.getElementById(id-9).querySelector("span").classList.add(other_eat, classes[2],classes[3], id)
                }  
            }
            
            if(id >= 48 && document.getElementById(id-8).classList.length < 3 && document.getElementById(id-16).classList.length < 3){
                if(bool_play_when_chess(-8, id)){
                    document.getElementById(id-8).querySelector("span").classList.add(predict_move, classes[2],classes[3], id)
                } if(bool_play_when_chess(-16, id)){
                    document.getElementById(id-16).querySelector("span").classList.add(predict_move, classes[2],classes[3], id)
                }
                
            }
            
            
            else if(0 <= id-8 && document.getElementById(id-8).classList.length < 3 && bool_play_when_chess(-8, id)){
                document.getElementById(id-8).querySelector("span").classList.add(predict_move, classes[2],classes[3], id)
            }
        } else if(classes[3] == "black_pawn"){
            if(Math.floor((id+7)/8) == Math.floor(id/8)+1 && bool_play_when_chess(7, id)){
                if(bool_eat(7, id)){
                    document.getElementById(id+7).querySelector("span").classList.add(other_eat, classes[2],classes[3], id)
                } 
            }
            if(Math.floor((id+9)/8) == Math.floor(id/8)+1 && bool_play_when_chess(9, id)){
                if (bool_eat(9, id)){
                    document.getElementById(id+9).querySelector("span").classList.add(other_eat, classes[2],classes[3], id)
                }  
            }
            
            
            if(id <= 15 && document.getElementById(id+8).classList.length < 3 && document.getElementById(id+16).classList.length < 3){
                if(bool_play_when_chess(+8, id)){
                    document.getElementById(id+8).querySelector("span").classList.add(predict_move, classes[2],classes[3], id)
                } if(bool_play_when_chess(+16, id)){
                    document.getElementById(id+16).querySelector("span").classList.add(predict_move, classes[2],classes[3], id)
                }      
            }
            
            else if(id+8 <= 63 && document.getElementById(id+8).classList.length < 3 && bool_play_when_chess(+8, id)){
                    document.getElementById(id+8).querySelector("span").classList.add(predict_move, classes[2],classes[3], id)
            }


        }else if(classes[3] == "white_knight" || classes[3] == "black_knight"){
            /* Gérer le eat*/
            if(0 <= id+10 && id+10 <= 63 && Math.floor((id+10)/ 8) == Math.floor(id/8)+1 && bool_play_when_chess(10, id)){
                if(document.getElementById(id+10).classList.length < 3){
                    document.getElementById(id+10).querySelector("span").classList.add(predict_move, classes[2],classes[3], id)
                } else if(bool_eat(+10, id)){
                    document.getElementById(id+10).querySelector("span").classList.add(other_eat, classes[2],classes[3], id)
                }
            }
            if(0 <= id-10 && id-10 <= 63 && (Math.floor((id-10)/ 8) == Math.floor(id/8)-1) && bool_play_when_chess(-10, id)){
                if(document.getElementById(id-10).classList.length < 3){
                    document.getElementById(id-10).querySelector("span").classList.add(predict_move, classes[2],classes[3], id)
                } else if(bool_eat(-10, id)){
                    document.getElementById(id-10).querySelector("span").classList.add(other_eat, classes[2],classes[3], id)
                }
            }
            if(0 <= id+6 && id+6 <= 63 && (Math.floor((id+6)/ 8) == Math.floor(id/8)+1) && bool_play_when_chess(6, id)){
                if(document.getElementById(id+6).classList.length < 3){
                    document.getElementById(id+6).querySelector("span").classList.add(predict_move, classes[2],classes[3], id)
                } else if(bool_eat(+6, id)){
                    document.getElementById(id+6).querySelector("span").classList.add(other_eat, classes[2],classes[3], id)
                }
            }
            if(0 <= id-6 && id-6 <= 63 && (Math.floor((id-6)/ 8) == Math.floor(id/8)-1) && bool_play_when_chess(-6, id)){
                if(document.getElementById(id-6).classList.length < 3){
                    document.getElementById(id-6).querySelector("span").classList.add(predict_move, classes[2],classes[3], id)
                } else if(bool_eat(-6, id)){
                    document.getElementById(id-6).querySelector("span").classList.add(other_eat, classes[2],classes[3], id)
                }
            } if(0 <= id+15 && id+15 <= 63 && (Math.floor((id+15)/ 8) == Math.floor(id/8)+2) && bool_play_when_chess(15, id)){
                if(document.getElementById(id+15).classList.length < 3){
                    document.getElementById(id+15).querySelector("span").classList.add(predict_move, classes[2],classes[3], id)
                } else if(bool_eat(+15, id)){
                    document.getElementById(id+15).querySelector("span").classList.add(other_eat, classes[2],classes[3], id)
                }
            }
            if(0 <= id-15 && id-15 <= 63 && (Math.floor((id-15)/ 8) == Math.floor(id/8)-2) && bool_play_when_chess(-15, id)){
                if(document.getElementById(id-15).classList.length < 3){
                    document.getElementById(id-15).querySelector("span").classList.add(predict_move, classes[2],classes[3], id)
                } else if(bool_eat(-15, id)){
                    document.getElementById(id-15).querySelector("span").classList.add(other_eat, classes[2],classes[3], id)
                }
            } if(0 <= id+17 && id+17 <= 63 && (Math.floor((id+17)/ 8) == Math.floor(id/8)+2) && bool_play_when_chess(17, id)){
                if(document.getElementById(id+17).classList.length < 3){
                    document.getElementById(id+17).querySelector("span").classList.add(predict_move, classes[2],classes[3], id)
                } else if(bool_eat(+17, id)){
                    document.getElementById(id+17).querySelector("span").classList.add(other_eat, classes[2],classes[3], id)
                }
            }
            if(0 <= id-17 && id-17 <= 63 && (Math.floor((id-17)/ 8) == Math.floor(id/8)-2) && bool_play_when_chess(-17, id)){
                if(document.getElementById(id-17).classList.length < 3){
                    document.getElementById(id-17).querySelector("span").classList.add(predict_move, classes[2],classes[3], id)
                } else if(bool_eat(-17, id)){
                    document.getElementById(id-17).querySelector("span").classList.add(other_eat, classes[2],classes[3], id)
                }
            }
    
        } else if(classes[3] == "white_bishop" || classes[3] == "black_bishop" || classes[3] == "white_queen" || classes[3] == "black_queen"){
            cpt_h_d = 7
            
            while(0 <= id - cpt_h_d && document.getElementById(id-cpt_h_d).classList.length == 2 && (Math.floor((id-cpt_h_d)/ 8) == Math.floor(id/8)-(cpt_h_d/7)) && bool_play_when_chess(-cpt_h_d, id)){
                document.getElementById(id-cpt_h_d).querySelector("span").classList.add(predict_move, classes[2],classes[3], id)
                cpt_h_d = cpt_h_d + 7;
                
            }
            if((id-cpt_h_d >= 0) && (Math.floor((id-cpt_h_d)/ 8) == Math.floor(id/8)-(cpt_h_d/7)) && bool_eat(-cpt_h_d, id)){
                document.getElementById(id-cpt_h_d).querySelector("span").classList.add(other_eat, classes[2],classes[3], id)

            }
            cpt_h_g = 9
            while(0 <= id-cpt_h_g && document.getElementById(id-cpt_h_g).classList.length == 2 && (Math.floor((id-cpt_h_g)/ 8) == Math.floor(id/8)-(cpt_h_g/9)) && bool_play_when_chess(-cpt_h_g, id)){
                document.getElementById(id-cpt_h_g).querySelector("span").classList.add(predict_move, classes[2],classes[3], id)
                cpt_h_g = cpt_h_g + 9;
            } if((id-cpt_h_g >= 0) && (Math.floor((id-cpt_h_g)/ 8) == Math.floor(id/8)-(cpt_h_g/9)) && bool_eat(-cpt_h_g, id)){
                document.getElementById(id-cpt_h_g).querySelector("span").classList.add(other_eat, classes[2],classes[3], id)

            }
            cpt_b_d = 9
            while(id + cpt_b_d <= 63 && document.getElementById(id+cpt_b_d).classList.length == 2 && (Math.floor((id+cpt_b_d)/ 8) == Math.floor(id/8)+(cpt_b_d/9)) && bool_play_when_chess(cpt_b_d, id)){
                document.getElementById(id+cpt_b_d).querySelector("span").classList.add(predict_move, classes[2],classes[3], id)
                cpt_b_d = cpt_b_d + 9;
            } if((id+cpt_b_d <= 63) && (Math.floor((id+cpt_b_d)/ 8) == Math.floor(id/8)+(cpt_b_d/9)) && bool_eat(cpt_b_d, id)){
                document.getElementById(id+cpt_b_d).querySelector("span").classList.add(other_eat, classes[2],classes[3], id)

            }
            cpt_b_g  = 7
            while(id + cpt_b_g <= 63 && document.getElementById(id+cpt_b_g).classList.length == 2 && (Math.floor((id+cpt_b_g)/ 8) == Math.floor(id/8)+(cpt_b_g/7)) && bool_play_when_chess(cpt_b_g, id)){
                document.getElementById(id+cpt_b_g).querySelector("span").classList.add(predict_move, classes[2],classes[3], id)
                cpt_b_g = cpt_b_g + 7;
            }if((id+cpt_b_g <= 63) && (Math.floor((id+cpt_b_g)/ 8) == Math.floor(id/8)+(cpt_b_g/7)) && bool_eat(cpt_b_g, id)){
                document.getElementById(id+cpt_b_g).querySelector("span").classList.add(other_eat, classes[2],classes[3], id)

            }


        } if(classes[3] == "white_rock" || classes[3] == "black_rock" || classes[3] == "white_queen" || classes[3] == "black_queen"){
            cpt_h = 8
            
            while(0 <= id - cpt_h && document.getElementById(id-cpt_h).classList.length == 2 && (Math.floor((id-cpt_h)/ 8) == Math.floor(id/8)-(cpt_h/8)) && bool_play_when_chess(-cpt_h, id)){
                
                document.getElementById(id-cpt_h).querySelector("span").classList.add(predict_move, classes[2],classes[3], id)  
                cpt_h = cpt_h + 8;
                

            } if(0 <= id - cpt_h && (Math.floor((id-cpt_h)/ 8) == Math.floor(id/8)-(cpt_h/8)) && bool_eat(-cpt_h, id)){
                if(other_eat=="predict"){
                   supp_move_predict(id, -cpt_h, -8, classes, other_eat)
                }else {
                
                   document.getElementById(id-cpt_h).querySelector("span").classList.add(other_eat, classes[2],classes[3], id)
                }
                
            }

            cpt_g = 1
            while(0 <= id-cpt_g && document.getElementById(id-cpt_g).classList.length == 2 && (Math.floor((id-cpt_g)/ 8) == Math.floor(id/8)) && bool_play_when_chess(-cpt_g, id)){
                document.getElementById(id-cpt_g).querySelector("span").classList.add(predict_move, classes[2],classes[3], id)
                cpt_g = cpt_g + 1;
            } if(0 <= id - cpt_g && (Math.floor((id-cpt_g)/ 8) == Math.floor(id/8)) && bool_eat(-cpt_g, id)){
                document.getElementById(id-cpt_g).querySelector("span").classList.add(other_eat, classes[2],classes[3], id)
            }

            cpt_d = 1
            while(id + cpt_d <= 63 && document.getElementById(id+cpt_d).classList.length == 2 && (Math.floor((id+cpt_d)/ 8) == Math.floor(id/8)) && bool_play_when_chess(cpt_d, id)){
                document.getElementById(id+cpt_d).querySelector("span").classList.add(predict_move, classes[2],classes[3], id)
                cpt_d = cpt_d + 1;
            } if(id + cpt_d <= 63 && (Math.floor((id+cpt_d)/ 8) == Math.floor(id/8)) && bool_eat(cpt_d, id)){
                document.getElementById(id+cpt_d).querySelector("span").classList.add(other_eat, classes[2],classes[3], id)
            }

            cpt_b  = 8
            while(id + cpt_b <= 63 && document.getElementById(id+cpt_b).classList.length == 2 && (Math.floor((id+cpt_b)/ 8) == Math.floor(id/8)+(cpt_b/8)) && bool_play_when_chess(cpt_b, id)){
                document.getElementById(id+cpt_b).querySelector("span").classList.add(predict_move, classes[2],classes[3], id)
                cpt_b = cpt_b + 8;
            } if(id + cpt_b <= 63 && (Math.floor((id+cpt_b)/ 8) == Math.floor(id/8)+(cpt_b/8)) && bool_eat(cpt_b, id)){
                document.getElementById(id+cpt_b).querySelector("span").classList.add(other_eat, classes[2],classes[3], id)
            }
        }
}
}




function supp_move_predict(id, cpt, nb, classes, other_eat){
      if(document.getElementById(id+cpt).classList[3] != "white_king" || document.getElementById(id+cpt).classList[3] != "black_king"){
          document.getElementById(id+cpt).querySelector("span").classList.remove("predict")
          cpt -= nb
          while(cpt != nb){
                  document.getElementById(id+cpt).querySelector("span").classList.remove("predict_move")
                  cpt -= nb
          }
      }else{
        document.getElementById(id+cpt).querySelector("span").classList.add(other_eat, classes[2],classes[3], id)
      }

}



function bool_play_when_chess(nb, id, name="show"){
    if(document.getElementById("check").style.color != "red"){
        if(name != "show"){
            return document.getElementById(id+nb).classList[3] == "white_king" || document.getElementById(id+nb).classList[3] == "black_king"
        }
        return true // Quand il n'y a aucune raison de bloquer de jouer c'est quand y a pas d'échec
    } else if(document.getElementById(id).classList.contains("white_king") || document.getElementById(id).classList.contains("black_king")) {
        return document.getElementById(id+nb).querySelector("span").classList[1] != "predict_move" // Faire en sorte que le roi se barre dans le sens opposé
    }
    return document.getElementById(id+nb).querySelector("span").classList[1] == "predict_move" // On laisse les pièces jouer seulement si elles empechent au roi de se faire manger
}


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
    // On gère le cas de l'échec
    pred = false
    if(document.getElementById(id).classList[3] != "black_king" && document.getElementById(id).classList[3] != "white_king"){

        all_moves_and_eat(document.getElementById(id).classList, id, "predict", "predict_move")
        

        if(document.getElementsByClassName("white_king")[0].querySelector("span").classList[1] == "predict"){
            document.getElementById("check").style.color = "red";
            pred = true
            
        } else if(document.getElementsByClassName("black_king")[0].querySelector("span").classList[1] == "predict"){
            document.getElementById("check").style.color = "red";
            pred = true
        }
    }
    if(pred == false){
        document.getElementById("check").style.color = "transparent";
        a = document.getElementsByClassName("predict_move")    
        if (a.length > 0){
            for(j = a.length-1; j > -1; j-- ){
                document.getElementsByClassName("predict_move")[j].setAttribute("class", "hint");
            }
    } 
    }
    
        
    
    
    
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

    pred = false
    if(document.getElementById(id).classList[3] != "black_king" && document.getElementById(id).classList[3] != "white_king"){

        all_moves_and_eat(document.getElementById(id).classList, id, "predict", "predict_move")

        if(document.getElementsByClassName("white_king")[0].querySelector("span").classList[1] == "predict"){
            document.getElementById("check").style.color = "red";
            pred = true
        } else if(document.getElementsByClassName("black_king")[0].querySelector("span").classList[1] == "predict"){
            document.getElementById("check").style.color = "red";
            pred = true
        }
    }
    if(pred == false){
        document.getElementById("check").style.color = "transparent";
        a = document.getElementsByClassName("predict_move")
        if (a.length > 0){
            for(j = a.length-1; j > -1; j-- ){
                document.getElementsByClassName("predict_move")[j].setAttribute("class", "hint");
            }
    } 
    }
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






}, 10)
var joueurs = 0
window.onclick = function(e) {
    array1 = e.composedPath();
    if(array1[0].classList[0] == "hint"){
        array1.shift();
    }
    if((joueurs%2 == 0 && (array1[0].classList.contains("white_piece") || array1[0].querySelector("span").classList.contains("white_piece"))) || (joueurs%2 == 1 && (array1[0].classList.contains("black_piece") || array1[0].querySelector("span").classList.contains("black_piece"))) ){
        // On gère le cas du cpt, donc si pair, c'est les blancs qui jouent, si impair, c'est les noirs.
        // On a deux façons de vérifier si on veut jouer les blancs, soit la cause touchée détient une pièce et donc il suffit de voir si l'on trouve 'white_piece' ou 'black_piece'
        // Mais si l'on clique sur les 'hint', on va chercher dans la classe, le nom.
        click(array1[0].classList, parseInt(array1[0].id))
    }
    
    
};

function click(classes, id){
    eat_or_move = false
    if(document.getElementById(id).querySelector("span").classList.length > 1){
        console.log(document.getElementById(id).querySelector("span").classList)
        if(document.getElementById(id).querySelector("span").classList[1] == "show"){
            play(id)
            
        } else if (document.getElementById(id).querySelector("span").classList[1] == "active"){
            eat(classes, id)
        } else if(document.getElementById(id).querySelector("span").classList[1] == "predict_move"){
            
            var domElement = document.getElementById(id).querySelector("span");
            for(i = 1; i < 5; i++){
                let classToDelete = Array.from(domElement.classList)[1]; // Vu que l'on supprime, on a pas besoin de changer d'index
                domElement.classList.remove(classToDelete);
            }

            play(id)

        } 
        eat_or_move = true
        joueurs++;
        // Problème, on ne peut utiliser le check, 
        
        
        
    } 
    
    y = document.getElementsByClassName("show")
    x = document.getElementsByClassName("active")
    w = document.getElementsByClassName("predict")
    // On regarde si y avait un predict_move et si oui, on le remet.
    
    if (y.length > 0){
        for(i = y.length-1; i > -1; i-- ){
            if(document.getElementsByClassName("show")[i].classList[1] == "predict_move"){
                var domElement = document.getElementsByClassName("show")[i];
                for(z = 1; z < 5; z++){
                    let classToDelete = Array.from(domElement.classList)[5]; // Vu que l'on supprime, on a pas besoin de changer d'index
                    domElement.classList.remove(classToDelete);
            }
                
            } else{
                document.getElementsByClassName("show")[i].setAttribute("class", "hint");
            }
            
        }
    }
    if (x.length > 0){
        for(j = x.length-1; j > -1; j-- ){
            document.getElementsByClassName("active")[j].setAttribute("class", "hint");
        }
    }
    
    if (w.length > 0){
        for(j = w.length-1; j > -1; j-- ){
            document.getElementsByClassName("predict")[j].setAttribute("class", "hint");
        }
    } 

    all_moves_and_eat(classes, id, "active")
    
    
    }
    
