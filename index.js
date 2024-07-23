import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove, set} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://realtime-database-ead39-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings);
const database = getDatabase(app);

const listNameInputField = document.getElementById("list-name-input-field");
const openCartBtn = document.getElementById("open-cart-btn");
const allLists = ref(database, "shoppingLists");

openCartBtn.addEventListener("click", function() {
    const listName = listNameInputField.value;
    if (listName) {
        const newListRef = push(ref(database)); 
        set(newListRef, { name: listName }).then(() => {
            const listKey = newListRef.key; 
            console.log(`New list created with key: ${listKey}`);
            window.location.href = `CartPage.html?list=${listKey}`; 
        }).catch((error) => {
            console.error("Error setting new list:", error);
        });
    }
});

