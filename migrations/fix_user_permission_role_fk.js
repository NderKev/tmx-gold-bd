exports.up = async function (knex) {
  const hasUserRole = await knex.schema.hasTable('user_role');
  if (hasUserRole) {
    const [{ c }] = await knex('user_role').count('* as c');
    const count = Number(c);
    if (count === 0) {
      await knex('user_role').insert([
        { role: 'admin' },
        { role: 'customer' },
        { role: 'seller' }
      ]);
    }
  }

  const hasUserPermission = await knex.schema.hasTable('user_permission');
  if (!hasUserPermission) return;

  await knex.transaction(async (trx) => {
    try {
      await trx.raw('ALTER TABLE `user_permission` DROP FOREIGN KEY `user_permission_role_id_foreign`');
    } catch (e) {
      // ignore if constraint does not exist
    }

    try {
      await trx.raw(
        'ALTER TABLE `user_permission` ADD CONSTRAINT `user_permission_role_id_foreign` ' +
          'FOREIGN KEY (`role_id`) REFERENCES `user_role`(`id`) ' +
          'ON DELETE RESTRICT ON UPDATE CASCADE'
      );
    } catch (e) {
      // ignore if already exists
    }
  });
};

exports.down = async function (knex) {
  const hasUserPermission = await knex.schema.hasTable('user_permission');
  if (!hasUserPermission) return;

  await knex.transaction(async (trx) => {
    try {
      await trx.raw('ALTER TABLE `user_permission` DROP FOREIGN KEY `user_permission_role_id_foreign`');
    } catch (e) {
      // ignore if constraint does not exist
    }

    try {
      await trx.raw(
        'ALTER TABLE `user_permission` ADD CONSTRAINT `user_permission_role_id_foreign` ' +
          'FOREIGN KEY (`role_id`) REFERENCES `users`(`id`) ' +
          'ON DELETE RESTRICT ON UPDATE CASCADE'
      );
    } catch (e) {
      // ignore if already exists
    }
  });
};
