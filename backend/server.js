import 'dotenv/config'
import app from './src/app.js'
import { startCronJobs } from './src/utils/cronJobs.js'

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
    console.log("Server is running on " + PORT)
    startCronJobs()
})