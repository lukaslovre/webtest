let width = 0;
let ukupnoDonirano = 0;


function donateFun(){
    //sve za inputiranje:!!!
    let donatorName;
    if(document.getElementById('naziv-donatora').value == ''){
        donatorName = "ANONIMNO";
        console.log(donatorName);
    }
    else{
        donatorName = document.getElementById('naziv-donatora').value;
        donatorName = donatorName.toUpperCase();
        document.getElementById('naziv-donatora').value= '';
    }
    
    let donationAmount = document.getElementById('donationAmount').value;
    document.getElementById('donationAmount').value = '';

    if(donationAmount <= 0 || donationAmount== NaN){
        return;
    }

    ukupnoDonirano += parseInt(donationAmount);
    console.log(ukupnoDonirano);

    document.getElementById("myBar").style.width = width + "%";
    document.getElementById("kol-nov").innerHTML= ukupnoDonirano;
    width = parseInt(ukupnoDonirano / 100000 * 1000)/10;
    document.getElementById("posto").innerHTML= width;

    let ul = document.getElementById("dono-lista");
    let li = document.createElement("li");
    li.appendChild(document.createTextNode(donatorName + ' je donirao ' + donationAmount + ' HRK'));
    ul.insertAdjacentElement('afterbegin',li);
    document.getElementById('input-box').style.display='none';

    if(width <=100){
        document.getElementById("myBar").style.width = width + "%";
    }
    else{
        document.getElementById("myBar").style.width = "100%";
    }
}
