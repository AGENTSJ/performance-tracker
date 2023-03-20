let bttno= document.getElementById('addr');
bttno.addEventListener('click',addex)
let version;
let storeNames=[];

manager();//runs first to set all global variables//version//storenames
// deledb()
function addex(){
        let exername = document.getElementById('ex-name').value;
        let exweight = document.getElementById('ex_weight').value;
        //changed
        if(!storeNames.includes(exername)&&exername!=''){
        drawex(exername,exweight)
        initdb(exername,exweight);
    }else{
        alert('alerady exsist')
    }
}
function addset(event){
    let exweight = prompt('give the weight');
    // console.log(exweight);
    let temp = event.target.parentNode.id;
    let exkey = temp.split('-')[0]
    drawset(exweight,temp)
    addrepdb(exkey,exweight);
}
function deledb(){
    let confirm = prompt('Are you sure you want to delete all the data if yes type YES else No');
    if (confirm.toLocaleUpperCase()=='YES'){

        let delereq = indexedDB.deleteDatabase('ptrack');
        delereq.onsuccess = function(event){
            console.log('removed'+`${event.result}`);
            console.log(event);
        }
    }else{
        return 0;
    }
}
function manager(){
    let dbreq = indexedDB.open('ptrack');
    dbreq.onsuccess = function(event){
    db = event.target.result;
    version = db.version

    db.close();
    console.log('testdb ran suceesfully-version avilable');
    storeNames = Array.from(db.objectStoreNames);
    if(storeNames.lenght != 0){  
        datapoppulator(storeNames);
    }
    }
    dbreq.onerror = function(){
    console.log('version not avilable');
    }
  
}
function initdb(e,w){
    
  let data ={ kg: parseInt(w,10),rep:[]} 
  let db;
  let transaction;
  let store
  let storename = e.replaceAll(' ','');


  let dbreq = indexedDB.open('ptrack',version+1);
    dbreq.onerror = function (params) {
    console.log('error in initilisation');
    }
    dbreq.onupgradeneeded = function(event){
    console.log('dbreq is starting');
    db = event.target.result;
    db.createObjectStore(storename,{ keyPath: 'kg'});
    }
    dbreq.onsuccess = function(event){
        //
        console.log('dbreq is compelete');
    db = event.target.result;
    transaction = db.transaction([storename],'readwrite');
    store = transaction.objectStore(storename);
        let adddata = store.put(data)
        adddata.onsuccess = function(){
            alert('data added')
        }
        adddata.onerror = function(){
            console.log('error in add data');
            alert('exersise already exsist');
        }
    }
    


}
function addrepdb(id,w){
    weight = parseInt(w,10)
    let dbreq = indexedDB.open('ptrack');
    dbreq.onerror = function (params) {
        console.log('error in db-addrepdb');
    }
    dbreq.onsuccess = function (params) {
        let db = params.target.result;
        let data = {kg: weight,rep:[]};
        let transaction = db.transaction([id],'readwrite');
        let store = transaction.objectStore(id);

        let adddata = store.put(data);
        adddata.onerror = function (params) {
            console.log('error in add data');
        }
        adddata.onsuccess = function (params) {
            alert('set added')
        }

    }
    
}
function datapoppulator(array){
    // console.log(array);
    let getdata = indexedDB.open('ptrack');
    getdata.onerror = function(){
        console.log('error');
    }
    getdata.onsuccess=function (params) {
        let db = params.target.result;
        for(i=0;i<array.length;i++){
            let storename = array[i];
            let transaction = db.transaction([array[i]],'readonly');
            let store = transaction.objectStore(array[i]);
            let begin = 0;
            store.openCursor().onsuccess = function (event) {
            const cursor = event.target.result;
            if (cursor) {
            if(begin==0){
                drawex(storename,cursor.value.kg);
                begin = 1;
            }else{
                drawset(cursor.value.kg,storename)
            }
            cursor.continue();
        }   
    }
    }
        
    //  begin=0;   
        
    }

}
function artist(exkey,exweight,callby,excont,parent,heading){
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
            if(callby==1){//if called by drawset fn
                let set = document.getElementById(exkey);
                set.appendChild(inputs);
            }if(callby==0){//if called by drawex fn
                let bttn = document.createElement('button');
                bttn.innerText='add set';
                bttn.setAttribute('class','btn');
                bttn.setAttribute('onclick','addset(event)')
                excont.appendChild(heading);
                excont.appendChild(bttn);
                parent.appendChild(excont);
                let set = document.createElement('div');
                set.setAttribute('class','set');
                set.setAttribute('id',exkey)
                set.appendChild(inputs);
                excont.appendChild(set);
            }
}
function drawex(exername,exweight){
    let exkey = exername.replaceAll(' ','')
        let parent = document.getElementById('maincont');
        if(exername!=null&& !isNaN(exweight)&&exweight!=''){
        let excont = document.createElement('div')
        excont.setAttribute('class','excont');
        excont.setAttribute('id',`${exkey}-cont`);
        let heading = document.createElement('div');
        heading.setAttribute('class','head');
        heading.innerText = exername;
        artist(exkey,exweight,0,excont,parent,heading)//0 denotes callby drawex fn to artist
        }else{
            alert('provide correct format')
        }
}
function drawset(exweight,temp){
    if(exweight&& !isNaN(exweight)){
        let exkey = temp.split('-')[0]
        // console.log(exkey);
        artist(exkey,exweight,1);
        }
        else{
            return 0;
        }
}