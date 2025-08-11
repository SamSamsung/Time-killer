
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
            cell.classList.add("pawn")
            cell.classList.add("black")
        }else if(i == 6){
            cell.classList.add("pawn")
            cell.classList.add("white")
        } else if(i == 0){
            if((j == 0 || j == 7)){
                cell.classList.add("rock")
            } else if(j == 1 || j == 6){
                cell.classList.add("knight")
            } else if(j == 2 || j == 5){
                cell.classList.add("bishop")
            } else if(j == 3){
                cell.classList.add("queen")
            } else{
                cell.classList.add("king")
            }
            cell.classList.add("black")
        } else if(i == 7){
            
            if((j == 0 || j == 7)){
                cell.classList.add("rock")
            } else if(j == 1 || j == 6){
                cell.classList.add("knight")
            } else if(j == 2 || j == 5){
                cell.classList.add("bishop")
            } else if(j == 3){
                cell.classList.add("queen")
            } else{
                cell.classList.add("king")
            }
            cell.classList.add("white")
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
    console.log(array1)
    if(array1[0].classList[0] == "hint"){
        array1.shift();
    }
    console.log(array1)
};

show_hint()