exports.up = function(knex) {
    return Promise.all([
        knex.schema.createTable('user_otp', function (table) {
            table.increments();
            table.integer('email').index().references('email').inTable('users').onDelete('set null').onUpdate('cascade');
            table.text('otp');
            table.integer('expiry');
            table.timestamps();
        })
    ])
  };
  //Rollback migration
  exports.down = function(knex) {
    return Promise.all([
        knex.schema.dropTable('user_otp')
    ])
  };