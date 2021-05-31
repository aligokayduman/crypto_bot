import { Sequelize } from 'sequelize';
import DataTypes from 'sequelize';
import path from 'path';
const __dirname = path.resolve(path.dirname(''));

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: __dirname+'/app/db/bot.db',
    logging: false
});

const Pair = sequelize.define('Pair', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING
  },
  status: {
    type: DataTypes.BOOLEAN
  },
  minsl:{
    type: DataTypes.DOUBLE,
    defaultValue: 0
  }
}, {
  timestamps: true
});

export default Pair;