// Dashboard functionality for expense tracking with database persistence

document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the dashboard page
    if (!document.getElementById('expense-form')) {
        return;
    }

    // Transaction storage - will be loaded from API
    let transactions = [];

let transactions = [];

// Save to localStorage
function saveTransactions() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Load from localStorage
function loadTransactions() {
    const stored = localStorage.getItem('transactions');
    if (stored) {
        transactions = JSON.parse(stored);
        renderTransactions();
        updateTotals();
    }
}

// Show transactions on screen
function renderTransactions() {
    const list = document.getElementById('transactions-list');
    list.innerHTML = "";
    transactions.forEach((t, index) => {
        const div = document.createElement('div');
        div.classList.add('transaction-item');
        div.innerHTML = `
            <span>${t.description}</span>
            <span>${t.type === "income" ? "+" : "-"}$${t.amount}</span>
            <button onclick="deleteTransaction(${index})">X</button>
        `;
        list.appendChild(div);
    });
}

// Update totals
function updateTotals() {
    let income = 0, expense = 0;
    transactions.forEach(t => {
        if (t.type === "income") income += t.amount;
        else expense += t.amount;
    });
    document.getElementById('total-income').textContent = "$" + income.toFixed(2);
    document.getElementById('total-expenses').textContent = "$" + expense.toFixed(2);
    document.getElementById('net-balance').textContent = "$" + (income - expense).toFixed(2);
}

// Handle form submission
document.getElementById('expense-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const description = document.getElementById('description').value.trim();
    const amount = parseFloat(document.getElementById('amount').value);
    const type = document.getElementById('type').value;

    if (!description || isNaN(amount) || amount <= 0) {
        alert("Please enter a valid description and amount.");
        return;
    }

    const transaction = { description, amount, type };
    transactions.push(transaction);
    saveTransactions();
    renderTransactions();
    updateTotals();

    // Clear form
    document.getElementById('expense-form').reset();
});

}

// Delete
function deleteTransaction(index) {
    transactions.splice(index, 1);
    saveTransactions();
    renderTransactions();
    updateTotals();
}

// Form submit
document.getElementById('expense-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const type = document.getElementById('type').value;

    transactions.push({ description, amount, type });

    saveTransactions();
    renderTransactions();
    updateTotals();

    this.reset();
});

// Load when page opens
loadTransactions();


    // DOM elements
    const expenseForm = document.getElementById('expense-form');
    const descriptionInput = document.getElementById('description');
    const amountInput = document.getElementById('amount');
    const typeSelect = document.getElementById('type');
    const transactionsList = document.getElementById('transactions-list');
    const totalIncomeEl = document.getElementById('total-income');
    const totalExpensesEl = document.getElementById('total-expenses');
    const netBalanceEl = document.getElementById('net-balance');
    const printReportBtn = document.getElementById('print-report');

    // API functions
    async function loadTransactions() {
        try {
            const response = await fetch('/api/transactions');
            if (!response.ok) {
                throw new Error('Failed to load transactions');
            }
            transactions = await response.json();
            renderTransactions();
            updateSummary();
        } catch (error) {
            console.error('Error loading transactions:', error);
            showError('Failed to load transactions from database');
        }
    }

    async function createTransaction(transactionData) {
        try {
            const response = await fetch('/api/transactions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(transactionData)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to create transaction');
            }

            return await response.json();
        } catch (error) {
            console.error('Error creating transaction:', error);
            showError(error.message);
            throw error;
        }
    }

    async function deleteTransaction(id) {
        try {
            const response = await fetch(`/api/transactions/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete transaction');
            }

            return true;
        } catch (error) {
            console.error('Error deleting transaction:', error);
            showError('Failed to delete transaction');
            return false;
        }
    }

    // Initialize dashboard
    async function init() {
        await loadTransactions();
        
        // Add event listeners
        expenseForm.addEventListener('submit', handleFormSubmit);
        printReportBtn.addEventListener('click', printReport);
    }

    // Handle form submission
    async function handleFormSubmit(e) {
        e.preventDefault();

        const description = descriptionInput.value.trim();
        const amount = parseFloat(amountInput.value);
        const type = typeSelect.value;

        // Validation
        if (!description) {
            showError('Please enter a description');
            return;
        }

        if (!amount || amount <= 0) {
            showError('Please enter a valid amount greater than 0');
            return;
        }

        try {
            // Create transaction via API
            const newTransaction = await createTransaction({
                description,
                amount,
                type
            });

            // Reload transactions from database to get the updated list
            await loadTransactions();
            
            // Reset form
            expenseForm.reset();
            
            // Show success message
            showSuccess('Transaction added successfully!');
        } catch (error) {
            // Error already handled in createTransaction function
        }
    }

    // Generate unique ID
    function generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Render transactions list
    function renderTransactions() {
        if (transactions.length === 0) {
            transactionsList.innerHTML = '<p style="text-align: center; color: rgba(255,255,255,0.7); margin: 1rem 0;">No transactions yet. Add your first transaction above!</p>';
            return;
        }

        const transactionsHtml = transactions.map(transaction => `
            <div class="transaction-item" data-id="${transaction.id}">
                <div>
                    <div class="transaction-description">${escapeHtml(transaction.description)}</div>
                    <div style="font-size: 0.8rem; opacity: 0.7;">${formatDate(transaction.date)}</div>
                </div>
                <div style="display: flex; align-items: center;">
                    <span class="transaction-amount ${transaction.type}">
                        ${transaction.type === 'income' ? '+' : '-'}${formatCurrency(Math.abs(parseFloat(transaction.amount)))}
                    </span>
                    <button class="transaction-delete" onclick="deleteTransactionHandler(${transaction.id})" aria-label="Delete transaction">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14Z"/>
                            <path d="M10 11v6M14 11v6"/>
                        </svg>
                    </button>
                </div>
            </div>
        `).join('');

        transactionsList.innerHTML = transactionsHtml;
    }

    // Update summary statistics
    function updateSummary() {
        const totals = transactions.reduce((acc, transaction) => {
            const amount = parseFloat(transaction.amount);
            if (transaction.type === 'income') {
                acc.income += amount;
            } else {
                acc.expenses += amount;
            }
            return acc;
        }, { income: 0, expenses: 0 });

        const netBalance = totals.income - totals.expenses;

        totalIncomeEl.textContent = formatCurrency(totals.income);
        totalExpensesEl.textContent = formatCurrency(totals.expenses);
        netBalanceEl.textContent = formatCurrency(netBalance);

        // Color code the net balance
        if (netBalance > 0) {
            netBalanceEl.style.color = '#4CAF50';
        } else if (netBalance < 0) {
            netBalanceEl.style.color = '#F44336';
        } else {
            netBalanceEl.style.color = 'white';
        }
    }

    // Delete transaction handler
    window.deleteTransactionHandler = async function(id) {
        if (confirm('Are you sure you want to delete this transaction?')) {
            const success = await deleteTransaction(id);
            if (success) {
                await loadTransactions();
                showSuccess('Transaction deleted successfully!');
            }
        }
    };

    // Format date for display
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    }

    // Format currency
    function formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(amount);
    }

    // Escape HTML to prevent XSS
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Show error message
    function showError(message) {
        showMessage(message, 'error');
    }

    // Show success message
    function showSuccess(message) {
        showMessage(message, 'success');
    }

    // Show message
    function showMessage(message, type) {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.message');
        existingMessages.forEach(msg => msg.remove());

        const messageEl = document.createElement('div');
        messageEl.className = `message ${type}`;
        messageEl.textContent = message;
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 5px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            animation: slideIn 0.3s ease;
            ${type === 'error' ? 'background-color: #F44336;' : 'background-color: #4CAF50;'}
        `;

        document.body.appendChild(messageEl);

        // Auto remove after 3 seconds
        setTimeout(() => {
            messageEl.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (messageEl.parentNode) {
                    messageEl.remove();
                }
            }, 300);
        }, 3000);
    }

    // Print report
    function printReport() {
        // Create a printable version of the report
        const printWindow = window.open('', '_blank');
        const printContent = generatePrintReport();

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Financial Report - Riska's Finance</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 20px;
                        background: white;
                        color: black;
                    }
                    .header {
                        text-align: center;
                        margin-bottom: 30px;
                        border-bottom: 2px solid #333;
                        padding-bottom: 20px;
                    }
                    .header h1 {
                        margin: 0;
                        color: #333;
                    }
                    .header p {
                        margin: 5px 0 0 0;
                        color: #666;
                    }
                    .summary {
                        margin-bottom: 30px;
                        padding: 20px;
                        background: #f5f5f5;
                        border-radius: 8px;
                    }
                    .summary-item {
                        display: flex;
                        justify-content: space-between;
                        margin: 10px 0;
                        padding: 5px 0;
                        font-size: 16px;
                    }
                    .summary-item.balance {
                        border-top: 2px solid #333;
                        padding-top: 15px;
                        margin-top: 15px;
                        font-weight: bold;
                        font-size: 18px;
                    }
                    .transactions {
                        margin-top: 30px;
                    }
                    .transactions h2 {
                        color: #333;
                        border-bottom: 1px solid #ccc;
                        padding-bottom: 10px;
                    }
                    .transaction {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 10px 0;
                        border-bottom: 1px solid #eee;
                    }
                    .transaction:last-child {
                        border-bottom: none;
                    }
                    .transaction-info {
                        flex: 1;
                    }
                    .transaction-description {
                        font-weight: 500;
                        margin-bottom: 2px;
                    }
                    .transaction-date {
                        font-size: 12px;
                        color: #666;
                    }
                    .transaction-amount {
                        font-weight: bold;
                        font-size: 16px;
                    }
                    .transaction-amount.income {
                        color: #4CAF50;
                    }
                    .transaction-amount.expense {
                        color: #F44336;
                    }
                    .footer {
                        margin-top: 40px;
                        text-align: center;
                        font-size: 12px;
                        color: #666;
                        border-top: 1px solid #eee;
                        padding-top: 20px;
                    }
                    @media print {
                        body {
                            font-size: 12pt;
                        }
                    }
                </style>
            </head>
            <body>
                ${printContent}
            </body>
            </html>
        `);

        printWindow.document.close();
        printWindow.focus();
        
        // Wait for content to load then print
        setTimeout(() => {
            printWindow.print();
        }, 250);
    }

    // Generate print report content
    function generatePrintReport() {
        const totals = transactions.reduce((acc, transaction) => {
            if (transaction.type === 'income') {
                acc.income += transaction.amount;
            } else {
                acc.expenses += transaction.amount;
            }
            return acc;
        }, { income: 0, expenses: 0 });

        const netBalance = totals.income - totals.expenses;
        const reportDate = new Date().toLocaleDateString();

        const transactionsHtml = transactions.length > 0 ? transactions.map(transaction => `
            <div class="transaction">
                <div class="transaction-info">
                    <div class="transaction-description">${escapeHtml(transaction.description)}</div>
                    <div class="transaction-date">${transaction.displayDate}</div>
                </div>
                <div class="transaction-amount ${transaction.type}">
                    ${transaction.type === 'income' ? '+' : '-'}${formatCurrency(Math.abs(transaction.amount))}
                </div>
            </div>
        `).join('') : '<p>No transactions recorded.</p>';

        return `
            <div class="header">
                <h1>Financial Report</h1>
                <p>Riska's Finance Expense Tracker</p>
                <p>Report generated on: ${reportDate}</p>
            </div>

            <div class="summary">
                <h2>Summary</h2>
                <div class="summary-item">
                    <span>Total Income:</span>
                    <span>${formatCurrency(totals.income)}</span>
                </div>
                <div class="summary-item">
                    <span>Total Expenses:</span>
                    <span>${formatCurrency(totals.expenses)}</span>
                </div>
                <div class="summary-item balance">
                    <span>Net Balance:</span>
                    <span style="color: ${netBalance >= 0 ? '#4CAF50' : '#F44336'}">${formatCurrency(netBalance)}</span>
                </div>
            </div>

            <div class="transactions">
                <h2>Transactions (${transactions.length} total)</h2>
                ${transactionsHtml}
            </div>

            <div class="footer">
                <p>© 2025 Riska's Finance. All rights reserved.</p>
                <p>614 Crawford Ave, Dixon IL, 61021 | Phone: +1 (815) 677-5807 | Email: Riskas.finances@gmail.com</p>
            </div>
        `;
    }

    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }

        .transaction-item {
            transition: all 0.3s ease;
        }

        .transaction-item:hover {
            background-color: rgba(255, 255, 255, 0.1);
            border-radius: 5px;
        }

        .transaction-delete {
            transition: all 0.3s ease;
        }

        .transaction-delete:hover {
            transform: scale(1.1);
        }
    `;
    document.head.appendChild(style);

    // Initialize the dashboard
    init();

    // Export functionality for potential use
    window.dashboardFunctions = {
        exportData: function() {
            const dataStr = JSON.stringify(transactions, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `riskas-finance-data-${new Date().toISOString().split('T')[0]}.json`;
            link.click();
            URL.revokeObjectURL(url);
        },
        
        importData: function(jsonData) {
            try {
                const importedTransactions = JSON.parse(jsonData);
                if (Array.isArray(importedTransactions)) {
                    transactions = importedTransactions;
                    saveTransactions();
                    renderTransactions();
                    updateSummary();
                    showSuccess('Data imported successfully!');
                } else {
                    showError('Invalid data format');
                }
            } catch (error) {
                showError('Error importing data');
                console.error('Import error:', error);
            }
        },

        clearAllData: function() {
            if (confirm('Are you sure you want to clear all transaction data? This cannot be undone.')) {
                transactions = [];
                saveTransactions();
                renderTransactions();
                updateSummary();
                showSuccess('All data cleared successfully!');
            }
        }
    };
});
