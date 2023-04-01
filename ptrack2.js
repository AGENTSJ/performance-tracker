let bttno= document.getElementById('addr');
bttno.addEventListener('click',addex)
let version;
let datedata = new Map([
    [0,'sunday'],
    [1,'monday'],
    [2,'tuesday'],
    [3,'wednesday'],
    [4,'thursday'],
    [5,'friday'],
    [6,'saturday'],
    [7,'NA']
])
let dater = new Date();
let time =`${dater.getDate()}-${dater.getMonth()+1}-${dater.getFullYear()}`

manager();
function addex(){
        let exw = document.getElementById('ex_weight');
        let exername = document.getElementById('ex-name').value;
        let exweight = exw.value;    
        if(exername!==''){
            if(exweight==''){
                exw.focus();
            }else{
                if(exername.length<=15){
                    drawex(exername,exweight,null,datedata.get(new Date().getDay()))
                    initdb(exername,exweight);
                    document.getElementById('ex-name').value = null;
                    document.getElementById('ex_weight').value = null;
                }else{
                    alert('Shorten the name..what is this an essay?')
                }
            }
        }else{
            alert('alerady exsist or provide correct format')
        }   
}
function addset(event){
    let temp = event.target.parentNode.parentNode.id;
    let exkey = temp.split('-')[0];
    let ip = document.getElementById(`${exkey}-wip`);
    let exweight = parseInt(ip.value,10);
    let bttn = document.getElementById(`${exkey}-bttn`)
    if(event.target.classList.contains('flag')){
        bttn.innerText='+'
        if(!exweight==''){
            addsetdb(exkey,exweight);
        }
        ip.value = null;
        event.target.classList.remove('flag');
        ip.style['display']='none';
    }else{
        bttn.innerText='Add';
        ip.style['display']='inline-block'
        ip.focus()
        event.target.classList.add('flag');
    }
}
function deledb(){

    let console = document.getElementById('alert');
    console.style['height']='fit-content';
    document.getElementById('confirm').addEventListener('change',proceed)
    let rej = document.getElementById('reject')
    rej.addEventListener('change',reject)
    function proceed(){
        let delereq = indexedDB.deleteDatabase('ptrack');
            delereq.onsuccess = function(event){
            console.log('removed'+`${event.result}`);
            console.log(event);
        }
        location.reload();
    }
    function reject(){
        console.style['height']='0px';
        rej.checked = false;
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
        datapoppulator(1);
    }
    dbreq.onerror = function(){
    console.log('version not avilable');
    }
}
function initdb(e,w){
    add=0;
    if(version==1){
        version=version+1;
    }
    let db;
    let transaction;
    let store
    let storename = e.replaceAll(' ','');
    let data = {workname:storename,kg:[parseInt(w,10)],rep:[[0,0]],desc:'',day:datedata.get(new Date().getDay()),date:[ [time,time] ],max:[0]}//new--
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
            let welcome = document.getElementById('welc');
            welcome.style['display']='none' 
            // console.log('data added');
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
                data.date.push([time,time])
                data.max.push(0);
                let adddata = store.put(data);
                adddata.onerror = function (params) {
                    console.log('error in add data');
                }
                adddata.onsuccess = function (params) {
                    console.log('setadded');
                    drawset(parseInt(w,10),data.workname);
                }
            }else{
                alert('already exsist')
                location.reload()
            }
        }
    } 
}
function datapoppulator(callby){
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
                let day = cursor.value.day
                let firstkg = kgarray.pop();
                let firstrep = reparray.pop();
                let welcome = document.getElementById('welc');//removing the welcome cont
                welcome.style['display']='none' 
                if(callby==0){
                    drawex(cursor.value.workname,firstkg,firstrep,day);
                    for(i=0;i<kgarray.length;i++){
                        drawset(kgarray[i],cursor.value.workname,reparray[i]);
                    }
                }if(callby==1){
                    if(datedata.get(new Date().getDay())==cursor.value.day||cursor.value.day==''||cursor.value.day=='NA'){
                        drawex(cursor.value.workname,firstkg,firstrep,day);
                        for(i=0;i<kgarray.length;i++){
                            drawset(kgarray[i],cursor.value.workname,reparray[i]);
                        }
                    }
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
            inputs.setAttribute('id',`${exkey}-${exweight}-ip`)
            let repcross = document.createElement('div');
            repcross.innerText = 'X'
            repcross.setAttribute('class','cross');
            repcross.setAttribute('id',`${exkey}-${exweight}-cross`)
            repcross.setAttribute('onclick','deleterep(event)')

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
            newrep.setAttribute('type','number');
            newrep.setAttribute('placeholder','Reps')
            newrep.setAttribute('id',`${exkey}-${exweight}-newrep`)
            let submit = document.createElement('button');
            submit.setAttribute('id',`${exkey}-${exweight}`)
            submit.setAttribute('class','btn');
            submit.setAttribute('onclick','submitdata(event)');
            submit.innerText = 'O'
            inputs.appendChild(repcross)
            inputs.appendChild(inputweight)
            inputs.appendChild(inputexrep);
            inputs.appendChild(inputrep);
            inputs.appendChild(newrep);
            inputs.appendChild(submit)
            if(callby==1){//if called by drawset fn
                let set = document.getElementById(exkey);
                set.appendChild(inputs);
            }if(callby==0){//if called by drawex fn
                let tempcont = document.createElement('div');

                let bttn = document.createElement('button');
                bttn.innerText='+';
                bttn.setAttribute('id',`${exkey}-bttn`)
                bttn.setAttribute('class','plus');
                bttn.setAttribute('onclick','addset(event)')
                let wip = document.createElement('input');
                wip.setAttribute('type','number');
                wip.setAttribute('class','wip');
                wip.setAttribute('placeholder','Weight')
                wip.setAttribute('id',`${exkey}-wip`);
                tempcont.appendChild(bttn);
                tempcont.appendChild(wip);
                excont.appendChild(heading);
                excont.appendChild(tempcont);
                // excont.appendChild(wip)
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
function drawex(exername,exweight,rep,day){
    let exkey = exername.replaceAll(' ','')
        let parent = document.getElementById('maincont');
        if(exername!=null&& !isNaN(exweight)&&exweight!=''){
        let excont = document.createElement('div')
        excont.setAttribute('class','excont');
        excont.setAttribute('id',`${exkey}-cont`);
        let heading = document.createElement('div');
        let slectdate = document.createElement('select');
        slectdate.setAttribute('id','');
        slectdate.setAttribute('onchange','datechange(event)');
       for(i=0;i<=7;i++){
        let elem = document.createElement('option');
        elem.setAttribute('value',datedata.get(i));
        elem.innerText = datedata.get(i);
        if(day==datedata.get(i)){
            elem.selected=true;
        }
        slectdate.appendChild(elem);
       }
        heading.setAttribute('class','head');
        heading.setAttribute('id',`${exkey}-head`);
        heading.setAttribute('onclick','hideme(event)')
        heading.innerHTML = `<div id = '${exkey}-head-text' class="head-text">${exername}</div>`
        let cross = document.createElement('div');
        cross.innerText ='X';
        cross.setAttribute('class','cross');
        cross.setAttribute('onclick','deletework(event)');
        cross.setAttribute('id',`${exkey}-cross`);
        heading.appendChild(slectdate);
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
if(newrep!=''&&!isNaN(newrep)){
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
            if(data.rep[index].length==30){
                data.rep[index].shift();
                data.date[index].shift();
            }
            if(data.max[index]<parseInt(newrep,10)){
                data.max[index]=parseInt(newrep,10);
            }
            data.rep[index].push(parseInt(newrep,10))
            data.date[index].push(time);
               
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
    // let confirm = prompt(`Are you sure you want to delete ${work} if yes then type yes`)
    let console = document.getElementById('alert');
    console.style['height']='fit-content';
    document.getElementById('confirm').addEventListener('change',proceed)
    let rej = document.getElementById('reject')
    rej.addEventListener('change',reject)
    function proceed(){
        let dbreq = indexedDB.open('ptrack');
        dbreq.onsuccess = function(event){
            let db = event.target.result;
            let transaction = db.transaction(['workout'],'readwrite');
            let store = transaction.objectStore('workout');
            let deldata = store.delete(work);
            deldata.onsuccess = function(event){
                location.reload();
            }
        }
    }
    function reject(){
        console.style['height']='0px';
        rej.checked = false;
    }
}
function deleterep(eventd){
    let key = eventd.target.id.split('-');
    let dbreq = indexedDB.open('ptrack');
    dbreq.onsuccess = function(event){
        let db = event.target.result;
        let transaction = db.transaction(['workout'],'readwrite');
        let store = transaction.objectStore('workout');
        store.get(key[0]).onsuccess= function(event){
            let data = event.target.result;
            let index = data.kg.indexOf(key[1]);
            data.kg.splice(index,1);
            data.rep.splice(index,1);
            if(data.kg.length==0){
                deletework(eventd)
            }else{
                store.put(data).onsuccess=function(event){
                    let ip = document.getElementById(`${key[0]}-${key[1]}-ip`)
                    ip.style['display']='none';
                }
            }
        }
    }
}
function datechange(eventr){
    let key = eventr.target.parentNode.id.split('-')[0];
    let dbreq = indexedDB.open('ptrack');
    dbreq.onsuccess = function(event){
        let db = event.target.result;
        let transaction = db.transaction(['workout'],'readwrite');
        let store = transaction.objectStore('workout');
        store.get(key).onsuccess=function(event){
            let data= event.target.result;
            data.day=eventr.target.value;
            store.put(data).onsuccess=function(event){
            }
        }
    }
}
function showall(){
    let view = document.getElementById('viewer');
    let main = document.getElementById('maincont');
    if(view.innerText ==`View All`){
        main.innerHTML = '';
        datapoppulator(0);
        view.innerText=`${datedata.get(dater.getDay())+`'s`}`
    }else{
        main.innerHTML = '';
        view.innerText=`View All`;
        datapoppulator(1);
    }
}
function dispgraph(){
    let gip = document.getElementById('gptxt').value.replaceAll(' ','');
    let w = document.getElementById('gpw')
    let gpw = w.value;
    if(!gip==''){
        if(gpw==''){
            w.focus();
        }else{
            indexedDB.open('ptrack').onsuccess=function(event){
                let db = event.target.result;
                let transaction = db.transaction(['workout'],'readwrite');
                let store = transaction.objectStore('workout');
                let getdata= store.get(gip)
                getdata.onsuccess=function(event){
                    let data = event.target.result;
                    if(data==null){
                        console.log('error');
                    }else{
                        let max = document.getElementById('max');
                        let pl = document.getElementById('plot')
                        let index = data.kg.indexOf(parseInt(gpw,10));
                        if(index!==-1){
                            max.innerHTML=`<p>MAX: ${data.max[index]}</p>`
                        let xarray = data.date[index];
                        let yarray = data.rep[index];
                        let plotter = [
                            {x: xarray,y: yarray,mode: `lines`,type: 'scatter'}
                        ]
                        let layout = {
                            xaxis: { title: "date"},
                            yaxis: { title: "reps"},
                            title: `${data.workname} KG:${data.kg[index]}`
                            
                          };
                        Plotly.newPlot('plot',plotter,layout)
                        }else{
                            pl.innerHTML='';
                            max.innerHTML=`Weight nto found`
                        }
                    }
                }
            }
        }
        
    }
}