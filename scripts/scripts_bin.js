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

function conv(chiffre){
    L = []
    q = 1
    while(q != 0){
        q = Math.floor(chiffre/2);
        bits = chiffre % 2;
        chiffre = q;
        L.push(bits);
    }
    L.reverse()
    return L
}


function verif(){
    let cpt = 0
    nb = ""
    for(i=0; i<=7;i++){
        
        if(document.getElementById(i).innerHTML === "1"){
            cpt = cpt + 2**i
            nb = nb + "1"
        } else{
            nb = nb + "0"
        }
        
    }
    if(cpt.toString() === document.getElementById("Nombre a trouver").innerHTML){
        document.getElementById("gagne").classList.add("active")
        document.getElementById("overlay").classList.add("show")
    } else{
        document.getElementById("perdu").classList.add("active")
        document.getElementById("nombre").innerHTML = conv(parseInt(document.getElementById("Nombre a trouver").innerHTML))
        document.getElementById("overlay").classList.add("show")
    }
}
