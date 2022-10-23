import { DataSource } from 'typeorm';
require('dotenv').config()
import { options } from "../../ormconfig"


//Don't know how to handle it, any is workaround.
const PGDataSource = new DataSource( options as any)

export default PGDataSource