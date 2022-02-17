import * as dotenv from 'dotenv'
import { ColumnType } from 'typeorm'

dotenv.config()

const TIME_DATA_TYPE: ColumnType = process.env.JEST ? 'text' : 'timestamptz'
export default TIME_DATA_TYPE
