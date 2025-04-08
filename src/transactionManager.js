const fs = require('fs');
const path = require('path');
const { Transaction } = require('./transaction');

class TransactionManager {
  constructor(dataFile = path.join(__dirname, '../data/transactions.json')) {
    this.dataFile = dataFile;
    this.transactions = [];
    this.loadTransactions();
  }

  loadTransactions() {
    try {
      // Ensure the data directory exists
      const dataDir = path.dirname(this.dataFile);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      // Load transactions if file exists
      if (fs.existsSync(this.dataFile)) {
        const data = fs.readFileSync(this.dataFile, 'utf8');
        
        if (data) {
          const parsedData = JSON.parse(data);
          
          // Convert plain objects back to Transaction instances
          this.transactions = parsedData.map(t => {
            const transaction = new Transaction(t.description, t.amount, t.tags);
            transaction.id = t.id;
            transaction.date = new Date(t.date);
            return transaction;
          });
        }
      }
    } catch (error) {
      console.error('Error loading transactions:', error);
      this.transactions = [];
    }
  }

  saveTransactions() {
    try {
      const dataDir = path.dirname(this.dataFile);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      
      fs.writeFileSync(this.dataFile, JSON.stringify(this.transactions, null, 2), 'utf8');
    } catch (error) {
      console.error('Error saving transactions:', error);
    }
  }

  addTransaction(transaction) {
    this.transactions.push(transaction);
    this.saveTransactions();
    return transaction;
  }

  getAllTransactions() {
    return this.transactions;
  }

  getTransactionsByTag(tag) {
    return this.transactions.filter(t => t.hasTag(tag));
  }

  getTotalBalance() {
    return this.transactions.reduce((sum, t) => sum + t.amount, 0);
  }

  getTotalByTag(tag) {
    return this.getTransactionsByTag(tag)
      .reduce((sum, t) => sum + t.amount, 0);
  }
  
  deleteTransaction(id) {
    const index = this.transactions.findIndex(t => t.id === id);
    if (index !== -1) {
      this.transactions.splice(index, 1);
      this.saveTransactions();
      return true;
    }
    return false;
  }
}

module.exports = { TransactionManager };
