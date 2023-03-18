let bttn= document.getElementById('addr');
bttn.addEventListener('click',addex)
let version;



function addex(){
        let exername = document.getElementById('ex-name').value;
        let exweight = document.getElementById('ex_weight').value;
        let exkey = exername.replaceAll(' ','')
        let parent = document.getElementById('maincont');
        if(exername!=null&& !isNaN(exweight)){
        let excont = document.createElement('div')
        excont.setAttribute('class','excont');
        excont.setAttribute('id',`${exkey}-cont`);
        let heading = document.createElement('div');
        heading.setAttribute('class','head');
        heading.innerText = exername;

        let set = document.createElement('div');
        set.setAttribute('class','set');
        set.setAttribute('id',exkey)

        let inputs = document.createElement('div');
        inputs.setAttribute('class','ip');
        let inputweight = document.createElement('input');
        inputweight.setAttribute('class','reps');
        inputweight.setAttribute('id',`${exkey}-${exweight}-kg`)
        inputweight.value=exweight;
        let inputexrep = document.createElement('input');
        inputexrep.setAttribute('class','reps');
        inputexrep.value=0;
        inputexrep.setAttribute('id',`${exkey}-${exweight}-exrep`)
        let inputrep = document.createElement('input');
        inputrep.setAttribute('class','reps');
        inputrep.value=0;
        inputrep.setAttribute('id',`${exkey}-${exweight}-rep`)
        let newrep = document.createElement('input');
        newrep.setAttribute('class','reps');
        newrep.setAttribute('id',`${exkey}-${exweight}-newrep`)
        let submit = document.createElement('button');
        submit.setAttribute('class','btn');
        submit.setAttribute('onclick','submitdata(event)');
        submit.innerText = 'submit'
        let bttn = document.createElement('button');
        bttn.innerText='add set';
        bttn.setAttribute('class','btn');
        bttn.setAttribute('onclick','addset(event)')
        inputs.appendChild(inputweight)
        inputs.appendChild(inputexrep);
        inputs.appendChild(inputrep);
        inputs.appendChild(newrep);
        inputs.appendChild(submit)
        set.appendChild(inputs);
        excont.appendChild(heading);
        excont.appendChild(set);
        excont.appendChild(bttn);
        parent.appendChild(excont);

        initdb(exername,exweight);
        }else{
            alert('provide correct format')
        }
}

function addset(event){
    let exweight = prompt('give the weight');
    // console.log(exweight);
    if(exweight&& !isNaN(exweight)){
    

    let temp = event.target.parentNode.id;
    let exkey = temp.split('-')[0]
    console.log(exkey);

    let inputs = document.createElement('div');
        inputs.setAttribute('class','ip');
        let inputweight = document.createElement('input');
        inputweight.setAttribute('class','reps');
        inputweight.setAttribute('id',`${exkey}-${exweight}-kg`)
        inputweight.value=exweight;
        let inputexrep = document.createElement('input');
        inputexrep.setAttribute('class','reps');
        inputexrep.value=0;
        inputexrep.setAttribute('id',`${exkey}-${exweight}-exrep`)
        let inputrep = document.createElement('input');
        inputrep.setAttribute('class','reps');
        inputrep.value=0;
        inputrep.setAttribute('id',`${exkey}-${exweight}-rep`)
        let newrep = document.createElement('input');
        newrep.setAttribute('class','reps');
        newrep.setAttribute('id',`${exkey}-${exweight}-newrep`)
        let submit = document.createElement('button');
        submit.setAttribute('class','btn');
        submit.setAttribute('onclick','submitdata(event)');
        submit.innerText = 'submit'
        inputs.appendChild(inputweight)
        inputs.appendChild(inputexrep);
        inputs.appendChild(inputrep);
        inputs.appendChild(newrep);
        inputs.appendChild(submit)
        let set = document.getElementById(exkey);
        // console.log();
        set.appendChild(inputs);
    }
    else{
        return 0;
    }

}
function deledb(){

    let delereq = indexedDB.deleteDatabase('ptrack');
    delereq.onsuccess = function(event){
        console.log('removed'+`${event.result}`);
        console.log(event);
    }
}
function testdb(){
    let dbreq = indexedDB.open('ptrack');
  dbreq.onsuccess = function(event){
    db = event.target.result;
    
    version = db.version
    db.close();
    console.log('testdb ran suceesfully-version avilable');
    

    const storeNames = Array.from(db.objectStoreNames);

    console.log(storeNames);
  }
  dbreq.onerror = function(){
    console.log('version not avilable');
  }
  
}
testdb()

function initdb(e,w){
    // console.log(version);
  let data ={ kg: parseInt(w,10),rep:[]} 
  let db;
  let transaction;
  let store
  let storename = e.replaceAll(' ','');
//   console.log(storename);

  let dbreq = indexedDB.open('ptrack',version+1);

    dbreq.onerror = function (params) {
    console.log('error in initilisation');
    }

    dbreq.onupgradeneeded = function(event){
    db = event.target.result;
    db.createObjectStore(storename,{ keyPath: 'kg'});
    }

    dbreq.onsuccess = function(event){
    db = event.target.result;
    transaction = db.transaction([storename],'readwrite');
    store = transaction.objectStore(storename);

        let adddata = store.put(data)
        adddata.onsuccess = function(){
            alert('data added')
        }
        adddata.onerror = function(){
            console.log('error in add data');
        }
    }
    


}