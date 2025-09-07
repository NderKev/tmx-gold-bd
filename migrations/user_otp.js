exports.up = function(knex) {
    return Promise.all([
        knex.schema.createTable('user_otps', function (table) {
            table.increments();
            table.string('email').index().references('email').inTable('users').onDelete('restrict').onUpdate('cascade');
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
        knex.schema.dropTable('user_otps')
    ])
  };
