exports.up = function (knex) {
  return knex.schema.alterTable('users', function (table) {
    table.integer('failed_attempts').defaultTo(0).notNullable()
      .comment('Number of consecutive failed login attempts');
    table.timestamp('locked_until').nullable()
      .comment('Timestamp when user can attempt to log in again');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('users', function (table) {
    table.dropColumn('failed_attempts');
    table.dropColumn('locked_until');
  });
};