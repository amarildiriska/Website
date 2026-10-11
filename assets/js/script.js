// Load transactions from localStorage or start with an empty list
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// Save transactions to localStorage
function saveTransactions() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Render transactions in the list
function renderTransactions() {
    const list = document.getElementById("transaction-list");
    list.innerHTML = ""; // clear before re-render

    transactions.forEach((t, index) => {
        const li = document.createElement("li");
        li.textContent = `${t.date} - ${t.description} - $${t.amount}`;
        
        // Delete button
        const delBtn = document.createElement("button");
        delBtn.textContent = "Delete";
        delBtn.onclick = () => {
            deleteTransaction(index);
        };
        
        li.appendChild(delBtn);
        list.appendChild(li);
    });
}

// Add a new transaction
function addTransaction(transaction) {
    transactions.push(transaction);
    saveTransactions();
    renderTransactions();
}

// Delete a transaction by index
function deleteTransaction(index) {
    transactions.splice(index, 1);
    saveTransactions();
    renderTransactions();
}

// Handle form submission
document.getElementById("transaction-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const date = document.getElementById("date").value;
    const description = document.getElementById("description").value;
    const amount = parseFloat(document.getElementById("amount").value);

    if (!date || !description || isNaN(amount)) {
        alert("Please fill all fields correctly!");
        return;
    }

    addTransaction({ date, description, amount });

    // Reset form
    document.getElementById("transaction-form").reset();
});

// Render on first load
window.onload = renderTransactions;
