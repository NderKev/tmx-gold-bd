
exports.up = function (knex) {
  return knex.schema
    .createTable('affiliates', (table) => {
      table.increments('id').primary();

      // ✅ Use unsigned for foreign keys
      table.bigInteger('affiliate_id').notNullable().unique().index(); // numeric code visible in URL
      table
        .integer('owner_user_id')
        .unsigned() // ✅ must match users.id type
        .index()
        .references('id')
        .inTable('users')
        .onDelete('RESTRICT')
        .onUpdate('CASCADE');

      table.string('name', 255).nullable(); // friendly name
      table.string('source', 100).nullable(); // e.g., "influencer", "campaign_2025"
      table.json('meta').nullable(); // free-form JSON metadata
      table.boolean('active').defaultTo(true);
      table.integer('total_clicks').defaultTo(0).notNullable();
      table.integer('total_signups').defaultTo(0).notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').nullable();
      table.timestamp('deleted_at').nullable();
    })

    .createTable('affiliate_clicks', (table) => {
      table.increments('id').primary();
      table.bigInteger('affiliate_id').notNullable().index();
      table.string('ip', 45).nullable();
      table.string('user_agent', 512).nullable();
      table.string('referrer', 1024).nullable();
      table.string('country', 100).nullable(); // optional geo lookup
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.index(['affiliate_id', 'created_at']);
    })

    .createTable('affiliate_conversions', (table) => {
      table.increments('id').primary();
      table.bigInteger('affiliate_id').notNullable().index();
      table
        .integer('user_id')
        .unsigned()
        .nullable()
        .index()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
      table.decimal('value', 14, 2).nullable(); // monetary value if any
      table.string('type', 100).nullable(); // 'signup','purchase'
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.index(['affiliate_id', 'created_at']);
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists('affiliate_conversions')
    .dropTableIfExists('affiliate_clicks')
    .dropTableIfExists('affiliates');
};
