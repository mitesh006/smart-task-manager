import Project from '../models/Project.model.js'
import Task from '../models/Task.model.js'
import User from '../models/User.model.js'

// @desc    Get platform statistics
// @route   GET /api/stats
// @access  Public
export const getStats = async (req, res) => {
  try {
    // Count projects
    const projectsCount = await Project.countDocuments()

    // Count tasks
    const tasksCount = await Task.countDocuments()

    // Count unique teams (users with team associations)
    const teamsCount = await User.countDocuments({ teams: { $exists: true, $ne: [] } })

    // Calculate uptime percentage (placeholder - always 99%)
    const uptime = 99

    const stats = [
      { number: projectsCount, suffix: '+', label: 'Projects Managed' },
      { number: tasksCount, suffix: '+', label: 'Tasks Completed' },
      { number: teamsCount, suffix: '+', label: 'Teams Active' },
      { number: uptime, suffix: '%', label: 'Uptime Record' },
    ]

    return res.status(200).json({
      success: true,
      stats,
    })
  } catch (error) {
    console.error('Get stats error:', error)
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching stats',
    })
  }
}
