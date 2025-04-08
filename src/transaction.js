class Transaction {
  constructor(description, amount, tags = []) {
    this.id = Date.now() + Math.random().toString(36).substr(2, 9);
    this.description = description;
    this.amount = amount;
    this.tags = tags;
    this.date = new Date();
  }

  hasTag(tag) {
    return this.tags.includes(tag);
  }
}

module.exports = { Transaction };
