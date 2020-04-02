const path = require('path');
const env = process.env.NODE_ENV || 'development';
const config = require('../../config/config.json')[env];
const migrationPath = path.resolve(__dirname + '/../../migrations');

const db = require('../../models');
const Account = db.Account;

const cli = require('../utils/cli');
const logger = require('../utils/logger');

let SignupDataProvider = {

  createAccount: async(account) => {
    return new Promise(function(resolve, reject) {
      Account.create(account)
        .then(data => {
          resolve(data);
        }).catch(err => {
          reject(err);
        });
    });
  },

  createTenantDB: async(accountId) => {
    let connectionString = `${config.dialect}://${config.username}:${config.password}@${config.host}/tenant_${accountId}`;

    logger.info(`Create Database for Tenant[Name: tenant_${accountId}]`);
    await cli.executeCommand(`node_modules/.bin/sequelize db:create --url ${connectionString}`);

    logger.info(`Run Migrations on Tenant Database[Name: tenant_${accountId}]`);
    await cli.executeCommand(`node_modules/.bin/sequelize db:migrate --url ${connectionString} --migrations-path=${migrationPath}`);
  }
};

module.exports = SignupDataProvider;
