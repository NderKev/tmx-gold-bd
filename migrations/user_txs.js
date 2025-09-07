exports.up = function (knex) {
    return Promise.all([
      knex.schema.createTable('transactions', function (table) {
        table.increments().primary();
        table.string('email').index().references('email').inTable('users').onDelete('restrict').onUpdate('cascade');
        table.string('address');
        table.string('tx_hash').unique();
        table.enum('mode',['avax', 'btc', 'eth', 'bnb', 'usdc', 'usdt', 'xrp']);
        table.enum('type',['debit', 'credit', 'loan', 'repayment', 'transfer']);
        table.string('to');
        table.enum('status',['complete', 'pending', 'failed']);
        table.float('value', 10, 5).unsigned();
        table.float('usd', 10, 5).unsigned();
        table.timestamps();
      })
    ])
  };
  //Rollback migration
  exports.down = function (knex) {
    return Promise.all([
      knex.schema.dropTable('transactions')
    ])
  };