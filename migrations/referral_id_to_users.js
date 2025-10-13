exports.up = function (knex) {
  return knex.schema.alterTable('users', (table) => {
    table.bigInteger('referral_id').unique().index().nullable();
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('users', (table) => {
    table.dropColumn('referral_id');
  });
};
