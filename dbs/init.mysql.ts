import config from 'src/configs/config';
import { DataSource, DataSourceOptions } from 'typeorm';

export const mysqlConfig: DataSourceOptions = {
  type: 'mysql',
  host: config.mysql.host,
  port: config.mysql.port,
  username: config.mysql.user,
  password: config.mysql.password,
  database: config.mysql.database,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/dbs/migrations/*.js'],
  synchronize: false,
};

const initMysql = new DataSource(mysqlConfig);

export default initMysql;
