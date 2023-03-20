

const dbName = 'ptrack';
const request = indexedDB.open(dbName,8);

request.onupgradeneeded = event => {
  const db = event.target.result;
  db.createObjectStore('bench', { keyPath: 'kg' });
  
  // create a new object store named "pullup"
  db.createObjectStore('pullup', { keyPath: 'kg' });
};

request.onsuccess = event => {
  const db = event.target.result;
  const transaction = db.transaction(['bench', 'pullup'], 'readwrite');
  
  const benchStore = transaction.objectStore('bench');
  const pullupStore = transaction.objectStore('pullup');
  
  const data1 = { kg: 70, rep: [0,1] };
  const data2 = { kg: 66, rep: [10,11,12,13,10,11] };
  
  benchStore.put(data1);
  pullupStore.put(data2);
  
  transaction.oncomplete = () => {
    console.log('Data added successfully');
  };
  db.close();
};

let getreq = indexedDB.open(dbName);

getreq.onerror=function(){
    console.log("oombi");
}
getreq.onsuccess = function(event){
    let db = event.target.result;
    
    const transaction = db.transaction(['bench', 'pullup'], 'readwrite');

    const benchStore = transaction.objectStore('bench');

    let getreq = benchStore.get(70);
    getreq.onerror = function(){
        console.log(`req 0mmbi`);
    }
    getreq.onsuccess = function(){
        const value = getreq.result;
        value.rep.push(2);
        console.log(value);
        let adddata = benchStore.put(value);
    
        adddata.onerror = function(){
            console.log('adddata oombi');
        }
        adddata.onsuccess = function(){
            console.log('add data work ayi')
        }
    }

}



// to check for usage

function checkstoreage(){
  if ('storage' in navigator && 'estimate' in navigator.storage) {
navigator.storage.estimate().then(function(estimate) {
  console.log('Usage', estimate.usage);
  console.log('Quota', estimate.quota);
});
}
}