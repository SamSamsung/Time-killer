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
            cell.classList.add("black_pawn")
        }else if(i == 6){
            cell.classList.add("white_pawn")
        } else if(i == 0){
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
        cpt++;

    }
}
}, 1)
