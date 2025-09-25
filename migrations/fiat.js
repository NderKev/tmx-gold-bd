exports.up = function (knex) {
    return Promise.all([
      knex.schema.createTable('fiat', function (table) {
        table.increments().primary();
        table.string('email').index().references('email').inTable('users').onDelete('restrict').onUpdate('cascade');
        table.string('ref_no').unique();
        table.enum('mode',['mpesa', 'paybill', 'till', 'paystack', 'card', 'bank', 'wire']);
        table.enum('fiat',['usd', 'kes']);
        table.string('to');
        table.enum('status',['complete', 'pending', 'failed']);
        table.float('amount', 10, 5).unsigned();
        table.float('usd', 10, 5).unsigned();
        table.timestamps();
      })
    ])
  };
  //Rollback migration
  exports.down = function (knex) {
    return Promise.all([
      knex.schema.dropTable('fiat')
    ])
  };