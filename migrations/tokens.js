exports.up = function (knex) {
    return Promise.all([
      knex.schema.createTable('tokens', function (table) {
        table.increments().primary();
        table.string('email').index().references('email').inTable('users').onDelete('restrict').onUpdate('cascade');
        table.string('address');
        table.string('tx_hash').unique();
        table.enum('type',['buy', 'sell', 'transfer']);
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
      knex.schema.dropTable('tokens')
    ])
  };