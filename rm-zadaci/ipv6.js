// inicijalizacija globalnih varijabli
let iporg
let inv=false;

//učitavanje IP adrese u varijablu
function getIp(){
    iporg = document.getElementById("ipUpis").value;
    iporg = iporg.toString();
    checkValid();
}

function checkValid(){
    //provjeravanje ispravnosti adrese:
    for(let i=0; i < iporg.length;i++){
        let tmp = iporg.toLowerCase();
        if (!(((tmp[i]>='a' && tmp[i]<='f') || (tmp[i]>='0' && tmp[i]<='9')|| tmp[i]==':') && (tmp.length==39)))
        {
            alert("invalidna adresa!");
            inv=true;
            break;
        }
       
    }
    if (inv==false){
        ipShort();
    }
    
}
    function ipShort(){
    
    //dijeljenje adrese na 8 dijelova i micanje nula (i postavljanje ":0000:" u ":0:")
    let ipsplittemp='';
    let ipsplit=iporg.split(":")
    let fisn=false;
    console.log(ipsplittemp);
 
    for (let i=0;i<ipsplit.length;i++){
        if (ipsplit[i][0]=='0'){
            fisn=true;
        }
        for(let j=0;j<ipsplit[i].length;j++){
            if (ipsplit[i][j]=='0' && fisn==true){
                if(j==3){
                    ipsplittemp+='0';
                }
                else{
                    ipsplittemp+='';
                }
                
            }
            else{
                ipsplittemp+=ipsplit[i][j];
                fisn=false;
            } 
        }
        if(i!=ipsplit.length-1){
        ipsplittemp+=':';
        }
    } 
    console.log("ipsplittemp: " + ipsplittemp);

    //uklanjanje više dvotočka u samo dvije
    let adresa=Infinity;
    let dvotemp=0;
    let ipfinalno='';
    for (let i=0;i<ipsplittemp.length;i++){
        if((ipsplittemp[i-1]==':' &&  ipsplittemp[i]=='0' && ipsplittemp[i+1]==':') || (ipsplittemp[i]=='0' && (i==0 || i==ipsplittemp.length-1)) ){
           if (dvotemp==0 || dvotemp==1){
            ipfinalno+='';
            dvotemp=1;
           }
        }
        else{
            ipfinalno+=ipsplittemp[i];

        }
        if(ipsplittemp[i]!='0' && ipsplittemp[i]!=':' && dvotemp==1){
            adresa=i;
            dvotemp=2;
            console.log(adresa);
            break;
            
        }
    }
    

    // kreiranje finalne IP adrese
    let tempo = ipsplittemp.split('');
    tempo.splice(0,adresa+1);
    let ipbezpoc = tempo.join('');
    let x;
    let pocetna;
    let kraj;


    //micanje više dvotočka
        //ako su nule na kraju
    if (adresa==Infinity){   
      
        ipfinalno+=':'
        console.log("ipfinalno: " + ipfinalno);
        getSpliceValue();
        console.log("pocetak: " + pocetna);
        console.log("kraj: " + kraj);
        kraj-=pocetna+1;

        x = ipfinalno.split('');
        x.splice(pocetna,kraj);
        ipfinalno = x.join('');

        document.getElementById("ipIspis").innerHTML=ipfinalno;
    }
        // ako nule nisu na kraju
   
    
    else{
        ipfinalno+=ipbezpoc;
        x = ipfinalno.split('');
        x.unshift(':');
        ipfinalno = x.join('');
        
        getSpliceValue();
        console.log("pocetak: " + pocetna);
        console.log("kraj: " + kraj);
        kraj-=pocetna+1;
        x = ipfinalno.split('');
        x.splice(pocetna,kraj);
        
        ipfinalno = x.join('');
  
       
        
        console.log("ipfinalno: " + ipfinalno);
        document.getElementById("ipIspis").innerHTML=ipfinalno;
        
    }
    console.log("Ipsplittemp nakon slice: " + ipbezpoc);
    
    

    //dobivanje adresa za rezanje
  
    function getSpliceValue(){
    
        let activate=false;
        for(let i=0;i<ipfinalno.length;i++){
            if (ipfinalno[i]==':' && ipfinalno[i+1]==':' && activate==false){
                pocetna=i;
                activate=true;
                
            }
            else if(activate==true && ipfinalno[i+1]!=':'){
                kraj = i;
                activate=false;
            }
        }   
    }
}

//funkcija za brisanje IPv6 adrese
function clearInput() {
    document.getElementById("ipUpis").value='';
    document.getElementById("ipIspis").innerHTML='Skraćena IPv6 adresa';

}



