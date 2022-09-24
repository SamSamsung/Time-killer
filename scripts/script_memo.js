var cpt = 0 
images = ["ben", "bg", "choco", "ed_dance", "phil", "sand", "trist", "ben", "bg", "choco", "ed_dance", "phil", "sand", "trist"]
var cpt_perdu = 7
var cpt_joueur = 1
var cpt_perdu_1 = 7
var cpt_perdu_2 = 7
var cpt_gagne_joueur_1 = 0
var cpt_gagne_joueur_2 = 0


function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
}

images = shuffle(images)
console.log(images)



setTimeout(function(){
    
  
},18)


function carte(id){
    if(document.getElementsByClassName("active").length < 2) {

        
        
        bite = document.getElementById(id)
        document.getElementById(id).classList.add("active")
        deux = document.getElementsByClassName("active")
        console.log(id)
        bite.style.backgroundImage = `url("./images/${images[id-1]}.jpg")`
        
         if(cpt % 2 === 1){
            
            setTimeout(function() {
                if(deux[0].style.backgroundImage == deux[1].style.backgroundImage) {
                    deux[1].style.visibility = "hidden"
                    deux[0].style.visibility = "hidden"
                    deux[1].classList.add("faits")
                    deux[0].classList.add("faits")
                    if((cpt_joueur % 2) + 1 === 1){
                        cpt_gagne_joueur_2 ++; /* cpt_joueur est une variable et si elle est impair elle représente le joueur 1, et si pair le joueur 2*/
                    } else {
                        cpt_gagne_joueur_1 ++;
                    }
                    
                    if(document.getElementsByClassName("faits").length === 14){
                        
                        if((cpt_gagne_joueur_2) < (cpt_gagne_joueur_1)){
                            document.getElementById("joueur_gagner").innerHTML = "Bravo au joueur 1 !"
                        } else if(cpt_gagne_joueur_1 === cpt_gagne_joueur_2){
                            document.getElementById("joueur_gagner").innerHTML = "Aucun gagnant ! Bravo a tous"
                        }
                        document.getElementById("gagne").classList.add("show")
                        document.getElementById("overlay").classList.add("show")
                        
                    }
    
                } else {
                    deux[1].style.backgroundImage = "none"
                    deux[0].style.backgroundImage = "none"
                    if((cpt_joueur % 2) + 1 === 1){
                        cpt_perdu_2--;
                        document.getElementById("essais").innerHTML = cpt_perdu_2;
                    } else {
                        cpt_perdu_1--;
                        document.getElementById("essais").innerHTML = cpt_perdu_1;
                    }
                    
                    if(cpt_perdu_1 === 0) {
                        document.getElementById("joueur_perdu").innerHTML = "Le joueur 1 n'avait plus d'essais"
                        document.getElementById("perdu").classList.add("show")
                        document.getElementById("overlay").classList.add("show")
                    } else if(cpt_perdu_2 == 0) {
                        document.getElementById("joueur_perdu").innerHTML = "Le joueur 2 n'avait plus d'essais"
                        document.getElementById("perdu").classList.add("show")
                        document.getElementById("overlay").classList.add("show")
                    }
                }
               
                deux[1].classList.remove("active")
                deux[0].classList.remove("active")
                document.getElementById("joueur").innerHTML = `Joueur ${cpt_joueur%2+1}`
                document.getElementById("num").innerHTML = `Joueur ${cpt_joueur%2+1}`
                
                cpt_joueur++;
                if((cpt_joueur % 2) + 1 === 1){
                    console.log("yo")
                    document.getElementById("essais").innerHTML = cpt_perdu_2; /* cpt_joueur est une variable et si elle est impair elle représente le joueur 1, et si pair le joueur 2*/
                } else {
                    document.getElementById("essais").innerHTML = cpt_perdu_1;
                }

                

                
            }, 1000)
            
        }


        cpt++;
    }

}
