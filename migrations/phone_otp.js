exports.up = function(knex) {
    return Promise.all([
        knex.schema.createTable('phone_otp', function (table) {
            table.increments();
            table.string('phone').unique();
            table.integer('otp');
            table.integer('expiry');
            table.tinyint('used').unsigned();
            table.timestamps();
        })
    ])
  };
  //Rollback migration
  exports.down = function(knex) {
    return Promise.all([
        knex.schema.dropTable('phone_otp')
    ])
  };