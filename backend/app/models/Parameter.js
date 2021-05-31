import { Sequelize } from 'sequelize';
import DataTypes from 'sequelize';
import path from 'path';
const __dirname = path.resolve(path.dirname(''));

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: __dirname+'/app/db/bot.db',
    logging: false
});

const Parameter = sequelize.define('Parameter', {
  iscronrunning: {
    type: DataTypes.BOOLEAN
  }
}, {
  timestamps: false
});

export default Parameter;