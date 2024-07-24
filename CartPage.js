import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove, get} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://realtime-database-ead39-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings);
const database = getDatabase(app);

const urlParams = new URLSearchParams(window.location.search);
const listKey = urlParams.get('list');

const shoppingListInDB = ref(database, `${listKey}/list`);
const nameRef = ref(database, `${listKey}/name`);

const container = document.getElementById("main-container-list-page");
const inputFieldEl = document.getElementById("input-field");
const shoppingList = document.getElementById("shopping-list");
const delPageContainer = document.getElementById("leave-or-delete-page-container");
const warningPage = document.getElementById("warning-page")

//text
const titleText = document.getElementById("list-name-title");
const listKeyText = document.getElementById("list-code-display");

//btns
const addButtonEl = document.getElementById("add-button");
const shareBtn = document.getElementById("share-btn");
const trashBtn = document.getElementById("trash-btn");
const leaveListBtn = document.getElementById("leave-btn");
const deleteListBtn = document.getElementById("delete-btn")
const yesBtn = document.getElementById("yes-btn");
const noBtn = document.getElementById("no-btn");

let previousSections = [];
let currentSection = "main-container-list-page";


//Show name of list
get(nameRef).then((snapshot) => {
    const listName = snapshot.val();
    titleText.textContent = listName;
})

//Set "list-key-text" as correct value
listKeyText.innerText = listKey;

onValue(shoppingListInDB, function(snapshot){
    if(snapshot.exists()){
        let listItems = Object.entries(snapshot.val());

        clearList();
        for (let i = 0; i < listItems.length; i++){
            let currentItem = listItems[i];
            let currentItemId = currentItem[0];
            let currentItemValue = currentItem[1];
            addItem(currentItem);
        }
    }else{
        shoppingList.innerHTML = "No items here... yet";
    }
})

addButtonEl.addEventListener("click", function() {
    if(inputFieldEl.value != ""){
        let inputValue = inputFieldEl.value;
        push(shoppingListInDB, inputValue);
        console.log(inputValue)
        clearInput();
        inputFieldEl.style.border = "0";;
    }else{
        inputFieldEl.style.border = "3px solid #D60000";;
    }
})

function addItem(item){
    let itemID = item[0];
    let itemVal = item[1];
    let newEl = document.createElement("li");
    newEl.textContent = itemVal;

    newEl.addEventListener('click', function(){
        let exactLocationOfItemInDB = ref(database, `${listKey}/list/${itemID}`);
        remove(exactLocationOfItemInDB);
        console.log("item removed");
    })
    shoppingList.append(newEl);
}

shareBtn.addEventListener("click", function(){
    if(currentSection == "main-container-list-page"){
        moveTo("share-code-page-container");
    }else{
        moveBack();
        container.style.display = 'flex';
    }
})

listKeyText.addEventListener("click", function(){
    navigator.clipboard.writeText(listKeyText.innerHTML);
    alert("Copied!");
})

trashBtn.addEventListener("click", function(){
    if(currentSection == ("main-container-list-page")){
        moveTo("leave-or-delete-page-container");
        delPageContainer.style.display = 'flex';
    }else{
        moveBack();
        container.style.display = 'flex';
    }
})

leaveListBtn.addEventListener("click", function(){
    let savedKeys = JSON.parse(localStorage.getItem("listKeys"));
    let validKeys = [];
    for(let key of savedKeys){
        if(listKey != key){
            validKeys.push(key);
        }
    }
    localStorage.setItem("listKeys", JSON.stringify(validKeys))
    window.location.href = "index.html";
})

deleteListBtn.addEventListener("click", function(){
    moveTo("warning-page");
    warningPage.style.display = 'flex';
})

noBtn.addEventListener("click", function(){
    moveBack();
    delPageContainer.style.display = 'flex';
})

yesBtn.addEventListener("click", function(){
    let exactLocationOfItemInDB = ref(database, listKey);
    remove(exactLocationOfItemInDB);
    window.location.href = "index.html";
})

function moveBackHTML(){
    if(currentSection == "main-container-list-page"){
        window.location.href = "index.html";
    }else{
        moveBack();
        container.style.display = 'flex';
    }
}
window.moveBackHTML = moveBackHTML;

function clearInput(){
    inputFieldEl.value = "";
}

function clearList(){
    shoppingList.innerHTML = "";
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
    console.log(currentSection + "closed");
    previousSections.push(currentSection);
    openSection(to);
    console.log(to + "opened");
    currentSection = to;
}

function moveBack(){
    let previousSection = previousSections.pop();
    closeSection(currentSection);
    openSection(previousSection);
    currentSection = previousSection;
}
