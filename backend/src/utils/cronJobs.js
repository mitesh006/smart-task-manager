import Task from "../models/Task.model.js"
import { sendMail } from "./mailer.js"
import { dueDateAlertTemplate } from "./emailTemplates.js"

// Interval set to 1 hour (3600000 ms)
const CHECK_INTERVAL = 60 * 60 * 1000

export const startCronJobs = () => {
    console.log("⌚ Starting Background Cron Jobs...")

    // Run the check every hour
    setInterval(async () => {
        try {
            console.log("🔍 Running Due Date Alert Check...")
            const now = new Date()
            const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000)

            // Find tasks due within 24 hours that haven't had an alert sent, and are not Done
            const tasksDueSoon = await Task.find({
                status: { $ne: "Done" },
                dueAlertSent: false,
                dueDate: { $gte: now, $lte: next24Hours },
                assignedTo: { $exists: true, $ne: null }
            }).populate("assignedTo").populate("project")

            if (tasksDueSoon.length > 0) {
                console.log(`⚠️ Found ${tasksDueSoon.length} tasks due soon. Sending alerts...`)

                for (const task of tasksDueSoon) {
                    if (task.assignedTo && task.assignedTo.email) {
                        const emailHtml = dueDateAlertTemplate(
                            task.title,
                            task.project?.name || "Unknown Project",
                            task.dueDate
                        )

                        await sendMail(
                            task.assignedTo.email,
                            "Action Required: Task Due Soon",
                            emailHtml
                        )

                        // Mark as sent
                        task.dueAlertSent = true
                        await task.save()
                        console.log(`✉️ Alert sent for task: ${task._id}`)
                    }
                }
            }
        } catch (error) {
            console.error("❌ Error running cron jobs:", error)
        }
    }, CHECK_INTERVAL)

    // Execute once immediately on startup
    setTimeout(async () => {
        try {
            const now = new Date()
            const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000)

            const tasksDueSoon = await Task.find({
                status: { $ne: "Done" },
                dueAlertSent: false,
                dueDate: { $gte: now, $lte: next24Hours },
                assignedTo: { $exists: true, $ne: null }
            }).populate("assignedTo").populate("project")

            for (const task of tasksDueSoon) {
                if (task.assignedTo && task.assignedTo.email) {
                    const emailHtml = dueDateAlertTemplate(task.title, task.project?.name || "Unknown Project", task.dueDate)
                    await sendMail(task.assignedTo.email, "Action Required: Task Due Soon", emailHtml)
                    task.dueAlertSent = true
                    await task.save()
                }
            }
        } catch (error) {
            console.error("Startup cron error:", error)
        }
    }, 5000)
}
