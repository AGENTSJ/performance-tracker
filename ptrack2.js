let bttno= document.getElementById('addr');
bttno.addEventListener('click',addex)
let version;


manager();
function addex(){
        let exername = document.getElementById('ex-name').value;
        let exweight = document.getElementById('ex_weight').value;
        if(exername!=''&&exweight!=''){
        drawex(exername,exweight)
        initdb(exername,exweight);
        document.getElementById('ex-name').value = null;
        document.getElementById('ex_weight').value = null;
    }else{
        alert('alerady exsist')
    }
}
function addset(event){
    let exweight = prompt('give the weight');
    let temp = event.target.parentNode.id;
    let exkey = temp.split('-')[0]
    drawset(exweight,temp)
    addsetdb(exkey,exweight);
}
function deledb(){
    let confirm = prompt('Are you sure you want to delete all the data if yes type YES else No');
    if (confirm.toLocaleUpperCase()=='YES'){

        let delereq = indexedDB.deleteDatabase('ptrack');
            delereq.onsuccess = function(event){
            console.log('removed'+`${event.result}`);
            console.log(event);
        }
        location.reload();
    }else{
        return 0;
    }
}
function manager(){
    let dbreq = indexedDB.open('ptrack');
    dbreq.onsuccess = function(event){
    db = event.target.result;
    version = db.version
    test('startup',1);
    db.close();
    console.log('testdb ran suceesfully-version avilable');
        datapoppulator();
    }
    dbreq.onerror = function(){
    console.log('version not avilable');
    }
  
}
function initdb(e,w){
    if(version==1){
        version=version+1;
    }
    let db;
    let transaction;
    let store
    let storename = e.replaceAll(' ','');
    let data = {workname:storename,kg:[parseInt(w,10)],rep:[[0,0]],desc:''}
    let dbreq = indexedDB.open('ptrack',version);
    dbreq.onerror = function (params) {
    console.log('error in initilisation');
    }
dbreq.onsuccess = function(event){
    db = event.target.result;
    
    transaction = db.transaction(['workout'],'readwrite');
    store = transaction.objectStore('workout');
        let adddata = store.add(data)
        adddata.onsuccess = function(){
            alert('data added')
        }
        adddata.onerror = function(){
            alert('exersise already exsist');
            location.reload();
        }
    }
}
function addsetdb(id,w){
    weight = parseInt(w,10)
    let dbreq = indexedDB.open('ptrack');
    dbreq.onerror = function (params) {
        console.log('error in db-addsetdb');
    }
    dbreq.onsuccess = function (params) {
        let db = params.target.result;
        let transaction = db.transaction(['workout'],'readwrite');
        let store = transaction.objectStore('workout');
        let getadat = store.get(id);
        getadat.onsuccess = function(event){
            let data = event.target.result;
            if(!data.kg.includes(weight)){

                data.kg.push(parseInt(w,10));
                data.rep.push([0,0])
                let adddata = store.put(data);
                adddata.onerror = function (params) {
                    console.log('error in add data');
                }
                adddata.onsuccess = function (params) {
                    alert('set added')
                }
            }else{
                alert('same set already there')
                location.reload()
            }
        }
    } 
}
function datapoppulator(){
    let getdata = indexedDB.open('ptrack');
    getdata.onerror = function(){
        console.log('error');
    }
    getdata.onsuccess=function (params) {
        let db = params.target.result;
        let transaction = db.transaction(['workout'],'readonly');
        let store = transaction.objectStore('workout');
        store.openCursor().onsuccess = function(event){
            let cursor = event.target.result;
            if(cursor){
                let kgarray = cursor.value.kg;
                let reparray = cursor.value.rep;

                let firstkg = kgarray.pop();
                let firstrep = reparray.pop();
                drawex(cursor.value.workname,firstkg,firstrep);
                for(i=0;i<kgarray.length;i++){
                    drawset(kgarray[i],cursor.value.workname,reparray[i]);
                }
                cursor.continue();
            }
        }
    }
}
function artist(exkey,exweight,callby,excont,parent,heading,rep){
    if(rep==null){
        rep=[0,0]
    }
    let inputs = document.createElement('div');
            inputs.setAttribute('class','ip');
            let inputweight = document.createElement('input');
            inputweight.setAttribute('class','weight dis');
            inputweight.setAttribute('id',`${exkey}-${exweight}-kg`)
            inputweight.value=exweight;
            let inputexrep = document.createElement('input');
            inputexrep.setAttribute('class','reps dis');
            inputexrep.setAttribute('id',`${exkey}-${exweight}-exrep`)
            let inputrep = document.createElement('input');
            inputrep.setAttribute('class','reps dis');
            inputrep.value=rep.pop();
            inputexrep.value=rep.pop();
            inputrep.setAttribute('id',`${exkey}-${exweight}-rep`)
            let newrep = document.createElement('input');
            newrep.setAttribute('class','reps');
            newrep.setAttribute('placeholder','Reps')
            newrep.setAttribute('id',`${exkey}-${exweight}-newrep`)
            let submit = document.createElement('button');
            submit.setAttribute('id',`${exkey}-${exweight}`)
            submit.setAttribute('class','btn');
            submit.setAttribute('onclick','submitdata(event)');
            submit.innerText = 'Submit'
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
                bttn.innerText='Add Set';
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
                let textcont = document.createElement('div');
                textcont.setAttribute('class','desc')
                textcont.setAttribute('id',`${exkey}-textcont`)
                let textbutton = document.createElement('div');
                textbutton.setAttribute('class','rotbtn');
                textbutton.setAttribute('onclick','disptxt(event)');
                textbutton.innerText = 'V'
                textbutton.setAttribute('id',`${exkey}-textbtn`)
                textcont.appendChild(textbutton)
                let text = document.createElement('textarea');
                text.setAttribute('id',`${exkey}-text`)
                text.setAttribute('placeholder',`Give youself a tips for the next work out..`)
                textcont.appendChild(text);
                excont.appendChild(textcont);
            }
}
function drawex(exername,exweight,rep){
    let exkey = exername.replaceAll(' ','')
        let parent = document.getElementById('maincont');
        if(exername!=null&& !isNaN(exweight)&&exweight!=''){
        let excont = document.createElement('div')
        excont.setAttribute('class','excont');
        excont.setAttribute('id',`${exkey}-cont`);
        let heading = document.createElement('div');
        
        heading.setAttribute('class','head');
        heading.setAttribute('id',`${exkey}-head`);
        heading.setAttribute('onclick','hideme(event)')
        heading.innerText = exername;
        let cross = document.createElement('div');
        cross.innerText ='X';
        cross.setAttribute('class','cross');
        cross.setAttribute('onclick','deletework(event)');
        cross.setAttribute('id',`${exkey}-cross`);
        heading.appendChild(cross)
        artist(exkey,exweight,0,excont,parent,heading,rep)//0 denotes callby drawex fn to artist
        }else{
            alert('provide correct format')
        }
}
function drawset(exweight,temp,rep){
    if(exweight&& !isNaN(exweight)){
        let exkey = temp.split('-')[0]
        // console.log(exkey);
        artist(exkey,exweight,1,null,null,null,rep);
        }
        else{
            return 0;
        }
}
function submitdata(event){
    let mainkey = event.target.id
    let exrepkey = `${mainkey}-exrep`;
    let repkey = `${mainkey}-rep`;
    let newrepkey =`${mainkey}-newrep`;
    let exrep = document.getElementById(exrepkey);
    let rep = document.getElementById(repkey).value;
    let newrep = document.getElementById(newrepkey).value;
if(newrep!=''){
    let dbreq = indexedDB.open('ptrack');
    dbreq.onsuccess = function(event){
        let db = event.target.result;
        let transaction = db.transaction([`workout`],'readwrite');
        let store = transaction.objectStore(`workout`);
        let kg = parseInt(mainkey.split('-')[1],10) 
        let getdata = store.get(mainkey.split('-')[0]);
        getdata.onsuccess = function(event){
            let data = event.target.result;
            let index = data.kg.indexOf(kg);
            data.rep[index].shift()
            data.rep[index].push(parseInt(newrep,10))
            
            let adddata = store.put(data);
            adddata.onsuccess = function(event){
                console.log('rep upated')
            }
        }
      
    } 
    document.getElementById(newrepkey).value = null;
    document.getElementById(repkey).value = newrep;
    document.getElementById(exrepkey).value = rep
    
}else{
    alert('provide correct format')
}

}
function test(name,call){
    if(call==1){
        if(version==1){
            version=version+1;
        }
        console.log('inside startup');
        let db;
        let dbreq = indexedDB.open('ptrack',version);
        dbreq.onerror = function (params) {
        console.log('error in initilisation');
        }
        dbreq.onupgradeneeded = function(event){
            // alert('inside upgradeneeded');
            db = event.target.result;
            db.createObjectStore('workout',{ keyPath: 'workname'});  
    }
   
    }else{
        console.log('startup not found')
        
        
    } 
}
function disptxt(event){
    let parent = event.target.parentNode.id;
    let classes = document.getElementById(parent).classList
    if(!classes.contains('flag')){
        savetext(parent,1)
        classes.add('flag');
        document.getElementById(parent).style['height']='fit-content'
        document.getElementById(`${parent.split('-')[0]}-textbtn`).style['transform']='rotate(0deg)';
        
    }else{
        savetext(parent,0)
        classes.remove('flag')
        document.getElementById(parent).style['height']='20px'
        document.getElementById(`${parent.split('-')[0]}-textbtn`).style['transform']='rotate(180deg)';
    }
}
function savetext(parent,callby){
    let textarea =document.getElementById(`${parent.split('-')[0]}-text`);
    let dbreq = indexedDB.open('ptrack');
    dbreq.onsuccess=function(event){
        let db = event.target.result;
        let transaction = db.transaction(['workout'],'readwrite');
        let store = transaction.objectStore('workout');
        let getdata = store.get(parent.split('-')[0]);
        getdata.onsuccess = function(event){
            let data = event.target.result;
            if(callby==1){
                textarea.value = data.desc;
            }
            if(callby==0){
                data.desc = textarea.value;
                let adddata = store.put(data);
                adddata.onerror=function(event){
                    alert('error occured in saving description')
                }
            }
        }
    }
    
}
function hideme(event){
    let key = `${event.target.id.split('-')[0]}-cont`;
    let cont = document.getElementById(key)
    let classes = cont.classList;
    if (!classes.contains('flag')) {
        cont.style['height'] = 'fit-content'
        classes.add('flag');
    }else{
        cont.style['height']= '65px';
        classes.remove('flag');
    }
    
}
function deletework(event){
    let key = event.target.id;
    let work  = key.split('-')[0];
    let confirm = prompt(`Are you sure you want to delete ${work} if yes then type yes`)
    if(confirm.toLocaleUpperCase()=='YES'){
        let dbreq = indexedDB.open('ptrack');
        dbreq.onsuccess = function(event){
            let db = event.target.result;
            let transaction = db.transaction(['workout'],'readwrite');
            let store = transaction.objectStore('workout');
            let deldata = store.delete(work);
            deldata.onsuccess = function(event){
                console.log(`data deleted`);
                location.reload();
            }
        }
    }
}
