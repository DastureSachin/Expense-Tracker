const balance = document.getElementById('balance');
const moneyPlus = document.getElementById('money-plus');
const moneyMinus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const incomeText = document.getElementById('income-text');
const expenseText = document.getElementById('expense');

let transactions = [];

function addTransaction(){
    if (incomeText.value.trim() !== "") {
        const incomeTransaction = {
            id: generateId(),
            text: text.value,
            amount: +incomeText.value
        };
        transactions.push(incomeTransaction);
        addTransactionDOM(incomeTransaction);
    }
    if (expenseText.value.trim() !== "") {
        const expenseTransaction = {
            id: generateId(),
            text: text.value,
            amount: -expenseText.value
        };
        transactions.push(expenseTransaction);
        addTransactionDOM(expenseTransaction);
    }

    updateValues();
    updateLocalStorage();

    text.value = "";
    incomeText.value = "";
    expenseText.value = "";
}

function generateId(){
    return Math.floor(Math.random() * 100000000);
}

function addTransactionDOM(transaction){
    const sign = transaction.amount < 0 ? '-' : '+';

    const item = document.createElement('li');
    item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

    item.innerHTML = `
        ${transaction.text} <span>${sign}₹${Math.abs(transaction.amount)}</span>
        <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>`;
    
    list.appendChild(item);
}

function updateValues(){
    const amounts = transactions.map(transaction => transaction.amount);

    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);

    const income = amounts
        .filter(item => item > 0)
        .reduce((acc, item) => (acc += item), 0)
        .toFixed(2);

    const expense = amounts
        .filter(item => item < 0)
        .reduce((acc, item) => (acc += item), 0)
        .toFixed(2);

    balance.innerText = `₹${total}`;
    moneyPlus.innerText = `₹${income}`;
    moneyMinus.innerText = `₹${Math.abs(expense)}`;
}

function removeTransaction(id){
    transactions = transactions.filter(transaction => transaction.id !== id);

    updateLocalStorage();
    init();
}

function updateLocalStorage(){
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function init(){
    list.innerHTML = '';
    transactions.forEach(addTransactionDOM);
    updateValues();
}

document.addEventListener('DOMContentLoaded', function(){
    form.addEventListener('submit', function(e){
        e.preventDefault();
        addTransaction();
    });
});

form.addEventListener('submit', addTransaction);
