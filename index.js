import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove, set, get, child} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://realtime-database-ead39-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings);
const database = getDatabase(app);

//Open List Buttons
const openListBtn = document.getElementById("open-saved-list-btn");
const addListBtn = document.getElementById("create-new-list-btn");
const joinListBtn = document.getElementById("join-list-button");

//Main Page Containers
const mainContainer = document.getElementById("main-page-container");
const openListContainer = document.getElementById("open-list-container");
    const savedLists = document.getElementById("saved-lists");
const addListContainer = document.getElementById("create-list-container");
    const createCartBtn = document.getElementById("create-cart-btn");
    const listNameInputField = document.getElementById("new-name-input-field");
const joinListContainer = document.getElementById("join-list-container");
    const joinShoppingListBtn = document.getElementById("join-cart-btn");
    const listCodeInputField = document.getElementById("list-code-input-field");
;

let previousSections = [];
let currentSection = "main-page-container"; 

let keysFromLocalStorage = JSON.parse(localStorage.getItem("listKeys"));
let savedKeys = [];
function refreshSavedKeys(){
    if (keysFromLocalStorage){
        keysFromLocalStorage = JSON.parse(localStorage.getItem("listKeys"));
        savedKeys = keysFromLocalStorage;
    }
}

function start(){
    refreshSavedKeys();
    renderKeys();
}

openListBtn.addEventListener("click", function(){
    refreshSavedKeys();
    moveTo("open-list-container");
    renderKeys();
    openListContainer.style.display = 'flex';
})


createCartBtn.addEventListener("click", function() {
    const listName = listNameInputField.value;
    if (listName) {
        const newListRef = push(ref(database)); 
        set(newListRef, { name: listName }).then(() => {
            const listKey = newListRef.key; 
            console.log(`New list created with key: ${listKey}`);
            saveListToLocalStorage(listKey);
            window.location.href = `CartPage.html?list=${listKey}`; 
        }).catch((error) => {
            console.error("Error setting new list:", error);
        });
    }
    console.log("button clicked");
});

joinShoppingListBtn.addEventListener("click", function(){
    let joinKey = listCodeInputField.value;
    
    if (joinKey){
        const listRef = ref(database, joinKey);
        get(listRef).then((snapshot) => {
            if (snapshot.exists()){
                if(!savedKeys.includes(joinKey)){
                    saveListToLocalStorage(joinKey);
                }
                window.location.href = `CartPage.html?list=${joinKey}`;
            }else{
                console.log("inputted code does not exist")
            }
        })
    }
})

function renderKeys(){
    console.log("render key starting");
    clearList();
    removeListNotInDB(savedKeys)
    for(let i = 0; i<savedKeys.length; i++){
        let listKey = savedKeys[i];
        const nameRef = ref(database, `${listKey}/name`);
        get(nameRef).then((snapshot) => {
            const listName = snapshot.val();
            let newEl = document.createElement("li");
            newEl.textContent = listName;
            newEl.addEventListener('click', function(){
                window.location.href = `CartPage.html?list=${listKey}`;
            })
            savedLists.append(newEl);
            console.log("rendered key");
        })
    }
}

async function removeListNotInDB(listKeys){
    let dbRef = ref(database);
    let validKeys =[];
    for(let key of listKeys){
        const snapshot = await get(child(dbRef, key));
        if (snapshot.exists()) {
            validKeys.push(key);
        } else {
            console.log(`Key ${key} does not exist in the database.`);
        }
    }
    localStorage.setItem("listKeys", JSON.stringify(validKeys))
}

function saveListToLocalStorage(listKey){
    savedKeys.push(listKey);
    console.log(savedKeys);
    localStorage.setItem("listKeys", JSON.stringify(savedKeys));
}

addListBtn.addEventListener("click", function(){
    moveTo("create-list-container");
    addListContainer.style.display = 'flex';
})

joinListBtn.addEventListener("click", function(){
    moveTo("join-list-container");
    joinListContainer.style.display = 'flex';
})

function moveBackPage(){
    moveBack();
    mainContainer.style.display = 'flex';
    mainContainer.style.gap = '10px';
}
window.moveBackPage = moveBackPage;

function clearList(){
    savedLists.innerHTML = "";
}

function openSection(sectionId) {
    let section = document.getElementById(sectionId);
    section.style.display = "block"; 
}

function closeSection(sectionId) {
    let section = document.getElementById(sectionId);
    section.style.display = "none";
}

function moveTo(to){
    closeSection(currentSection);
    console.log(currentSection + "closed")
    previousSections.push(currentSection);
    openSection(to);
    console.log(to + "opened")
    currentSection = to;
}

function moveBack(){
    let previousSection = previousSections.pop();
    closeSection(currentSection);
    openSection(previousSection);
    currentSection = previousSection;
}

start();