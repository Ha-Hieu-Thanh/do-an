require('dotenv').config();
import { DataSource } from 'typeorm';
import TaskManagerDefaultEntities from './entities/task-manager/z-index';
import migrations from './migrations';
export const dataTaskManagerSource = new DataSource({
  type: 'mysql',
  host: process.env.MYSQL_TASK_MANAGER_HOST,
  port: Number(process.env.MYSQL_TASK_MANAGER_PORT),
  username: process.env.MYSQL_TASK_MANAGER_USER,
  password: process.env.MYSQL_TASK_MANAGER_PASS,
  database: process.env.MYSQL_TASK_MANAGER_DB,
  timezone: 'Z',
  charset: 'utf8mb4',
  bigNumberStrings: false,
  entities: [...TaskManagerDefaultEntities],
  // make migrations will execute all file in folder ./migrations/ folder
  migrations,
  subscribers: [],
  synchronize: false,
  logging: process.env.NODE_ENV !== 'production',
  name: 'db1',
});
