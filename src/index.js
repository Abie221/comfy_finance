const readline = require('readline');
const { Transaction } = require('./transaction');
const { TransactionManager } = require('./transactionManager');

const manager = new TransactionManager();
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function displayMenu() {
  console.log('\n===== Personal Finance Tracker =====');
  console.log('1. Add a transaction');
  console.log('2. View all transactions');
  console.log('3. View transactions by tag');
  console.log('4. View total balance');
  console.log('5. View total by tag');
  console.log('6. Delete a transaction');
  console.log('7. Exit');
  rl.question('\nChoose an option (1-7): ', handleMenuOption);
}

function handleMenuOption(option) {
  switch (option) {
    case '1':
      addTransaction();
      break;
    case '2':
      viewAllTransactions();
      break;
    case '3':
      viewTransactionsByTag();
      break;
    case '4':
      viewTotalBalance();
      break;
    case '5':
      viewTotalByTag();
      break;
    case '6':
      deleteTransaction();
      break;
    case '7':
      console.log('Thank you for using Personal Finance Tracker!');
      rl.close();
      break;
    default:
      console.log('Invalid option. Please try again.');
      displayMenu();
  }
}

function addTransaction() {
  rl.question('Description: ', (description) => {
    rl.question('Amount (use negative for expenses): ', (amount) => {
      rl.question('Tags (comma separated): ', (tagsInput) => {
        const tags = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag);
        
        const transaction = new Transaction(description, parseFloat(amount), tags);
        manager.addTransaction(transaction);
        
        console.log(`Transaction added: ${description}, $${amount}`);
        displayMenu();
      });
    });
  });
}

function viewAllTransactions() {
  const transactions = manager.getAllTransactions();
  console.log('\n===== All Transactions =====');
  
  if (transactions.length === 0) {
    console.log('No transactions found.');
  } else {
    transactions.forEach(displayTransaction);
  }
  
  displayMenu();
}

function viewTransactionsByTag() {
  rl.question('Enter tag: ', (tag) => {
    const transactions = manager.getTransactionsByTag(tag);
    console.log(`\n===== Transactions with tag "${tag}" =====`);
    
    if (transactions.length === 0) {
      console.log(`No transactions found with tag "${tag}".`);
    } else {
      transactions.forEach(displayTransaction);
    }
    
    displayMenu();
  });
}

function viewTotalBalance() {
  const total = manager.getTotalBalance();
  console.log(`\nTotal Balance: $${total}`);
  displayMenu();
}

function viewTotalByTag() {
  rl.question('Enter tag: ', (tag) => {
    const total = manager.getTotalByTag(tag);
    console.log(`\nTotal for tag "${tag}": $${total}`);
    displayMenu();
  });
}

function deleteTransaction() {
  viewAllTransactions();
  
  rl.question('\nEnter ID of transaction to delete: ', (id) => {
    if (manager.deleteTransaction(id)) {
      console.log(`Transaction with ID ${id} deleted successfully.`);
    } else {
      console.log(`Transaction with ID ${id} not found.`);
    }
    displayMenu();
  });
}

function displayTransaction(transaction) {
  const dateStr = transaction.date.toLocaleDateString();
  const amountStr = transaction.amount >= 0 ? `+$${transaction.amount}` : `-$${Math.abs(transaction.amount)}`;
  console.log(`ID: ${transaction.id} | [${dateStr}] ${transaction.description}: ${amountStr} (Tags: ${transaction.tags.join(', ')})`);
}

// Add some sample data if no transactions exist
if (manager.getAllTransactions().length === 0) {
  manager.addTransaction(new Transaction('Grocery shopping', -50, ['food']));
  manager.addTransaction(new Transaction('Restaurant', -30, ['food', 'entertainment']));
  manager.addTransaction(new Transaction('Salary', 1000, ['income']));
}

console.log('Welcome to Personal Finance Tracker!');
displayMenu();