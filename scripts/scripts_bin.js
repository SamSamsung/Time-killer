
function rand(){
    return Math.floor(Math.random() * 255)
}

setTimeout(function(){
    var ran = rand()
    document.getElementById("Nombre a trouver").innerHTML = ran
}, 10)





function changer_nombre(id){
    let chiffre = document.getElementById(id) 
    if(chiffre.innerHTML === "0") {
        chiffre.innerHTML = 1
    }else{
        chiffre.innerHTML = 0
    }

    

}

function verif(){
    let cpt = 0
    for(i=0; i<=7;i++){
        
        if(document.getElementById(i).innerHTML === "1"){
            cpt = cpt + 2**i
        } 
        
    }
    if(cpt.toString() === document.getElementById("Nombre a trouver").innerHTML){
        console.log('o')
    }
    console.log(cpt)
}