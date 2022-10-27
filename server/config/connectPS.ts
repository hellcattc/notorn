import { DataSource } from 'typeorm';
import { options } from "../../ormconfig"

//Don't know how to handle it, any is workaround.
const pgDataSource = new DataSource(options as any)

export default pgDataSource