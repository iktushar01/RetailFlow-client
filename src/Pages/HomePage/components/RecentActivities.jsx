import React from 'react'

const RecentActivities = ({ data }) => {
  return (
    <div className="rounded-2xl bg-white/70 backdrop-blur ring-1 ring-slate-200/70 p-5 shadow-sm">
      <h2 className="font-semibold mb-4">Recent Activities</h2>
      <div className="relative">
        <div className="absolute left-3 top-0 bottom-0 w-px bg-slate-200" />
        <ul className="space-y-4">
          {data.recentActivities.length > 0 ? (
            data.recentActivities.map((activity, i) => (
              <li key={activity.id || i} className="pl-8 relative">
                <span className="absolute left-1 top-1.5 w-4 h-4 rounded-full bg-white ring-2 ring-indigo-500" />
                <div className="rounded-lg ring-1 ring-slate-200/70 p-3 bg-white/70">
                  <p className="text-sm font-medium">{activity.title}</p>
                  <p className="text-xs text-slate-500 mt-1">{activity.description}</p>
                  <p className="text-xs text-slate-400 mt-1">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
              </li>
            ))
          ) : (
            <li className="pl-8 relative">
              <span className="absolute left-1 top-1.5 w-4 h-4 rounded-full bg-white ring-2 ring-slate-300" />
              <div className="rounded-lg ring-1 ring-slate-200/70 p-3 bg-white/70">
                <p className="text-sm text-slate-500">No recent activities</p>
              </div>
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}

export default RecentActivities
