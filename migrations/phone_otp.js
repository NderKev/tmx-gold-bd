exports.up = function(knex) {
    return Promise.all([
        knex.schema.createTable('phone_otp', function (table) {
            table.increments();
            table.string('phone').index().references('phone').inTable('users').onDelete('restrict').onUpdate('cascade');
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