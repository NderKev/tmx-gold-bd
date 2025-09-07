exports.up = function(knex) {
    return Promise.all([
        knex.schema.createTable('user_balance', function (table) {
            table.increments();
            table.string('email').index().references('email').inTable('users').onDelete('restrict').onUpdate('cascade');
            table.string('address').unique();
            table.float('balance', 10, 5).unsigned();
            table.float('usd', 10, 5).unsigned();
            table.timestamps();
        })
    ])
  };
  //Rollback migration
  exports.down = function(knex) {
    return Promise.all([
        knex.schema.dropTable('user_balance')
    ])
  };