var cpt = 0 
images = ["ben", "bg", "choco", "ed_dance", "phil", "sand", "trist", "ben", "bg", "choco", "ed_dance", "phil", "sand", "trist"]
var cpt_perdu = 7
var cpt_joueur = 1
var cpt_perdu_1 = 7
var cpt_perdu_2 = 7


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

        if((cpt_joueur % 2) + 1 === 1){
            document.getElementById("essais").innerHTML = cpt_perdu_1;
        } else {
            document.getElementById("essais").innerHTML = cpt_perdu_2;
        }
        
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
                    
                    if(document.getElementsByClassName("faits").length === 14){
                        document.getElementById("gagne").classList.add("show")
                        document.getElementById("overlay").classList.add("show")
                        

                        
                    }
    
                } else {
                    deux[1].style.backgroundImage = "none"
                    deux[0].style.backgroundImage = "none"
                    if((cpt_joueur % 2) + 1 === 1){
                        cpt_perdu_1--;
                        document.getElementById("essais").innerHTML = cpt_perdu_1;
                    } else {
                        cpt_perdu_2--;
                        document.getElementById("essais").innerHTML = cpt_perdu_2;
                    }
                    
                    if(cpt_perdu === 0) {
                        document.getElementById("perdu").classList.add("show")
                        document.getElementById("overlay").classList.add("show")
                    }
                }
               
                deux[1].classList.remove("active")
                deux[0].classList.remove("active")
                document.getElementById("joueur").innerHTML = `Joueur ${cpt_joueur%2+1}`

                cpt_joueur++;

                

                
            }, 1000)
            
        }


        cpt++;
    }

}