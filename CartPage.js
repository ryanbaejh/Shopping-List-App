import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://realtime-database-ead39-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListInDB = ref(database, "shoppingList");

const inputFieldEl = document.getElementById("input-field");
const addButtonEl = document.getElementById("add-button");

const shoppingList = document.getElementById("shopping-list");

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
        shoppingList.innerHTML = "No items here... yet"
    }
})

addButtonEl.addEventListener("click", function() {
    if(inputFieldEl.value != ""){
        let inputValue = inputFieldEl.value
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
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`);
        remove(exactLocationOfItemInDB);
        console.log("item removed");
    })
    shoppingList.append(newEl);
}

function clearInput(){
    inputFieldEl.value = "";
}

function clearList(){
    shoppingList.innerHTML = "";
}

