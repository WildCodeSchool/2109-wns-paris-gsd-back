import * as dotenv from 'dotenv'
import { ColumnType } from 'typeorm'

dotenv.config()

const ENUM_DATA_TYPE: ColumnType = process.env.JEST ? 'text' : 'enum'
export default ENUM_DATA_TYPE;