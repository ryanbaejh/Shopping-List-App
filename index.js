import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://realtime-database-ead39-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings);
const database = getDatabase(app);

const listNameInputField = document.getElementById("list-name-input-field");
const openCartBtn = document.getElementById("open-cart-btn");

openCartBtn.addEventListener("click", function() {
    const listName = listNameInputField.value;
    if (listName) {
        const newListRef = push(ref(database, "shoppingLists"));
        const listKey = newListRef.key;
        newListRef.set({ name: listName });
        window.location.href = `CartPage.html?list=${listKey}`;
    }
});

