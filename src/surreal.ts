import {ConnectionProvider} from './websocket/connection-provider';
import * as dotenv from 'dotenv';
dotenv.config();

const client = new ConnectionProvider();
console.log('hello world');
