// ==========================================================
// EduGlobal - live-schedule.js
// ONE place for the live class timetable. Used by the homepage
// and the student dashboard. Edit the LIVE block to change it.
// ==========================================================

export const LIVE = {
  timezone: "Africa/Lagos",   // Nigeria time
  days: [1, 4, 5],            // 0=Sunday 1=Monday 2=Tuesday 3=Wednesday 4=Thursday 5=Friday 6=Saturday
  start: "17:00",             // class starts (24-hour clock)
  end: "20:00",               // class ends
  title: "EduGlobal Live Class"
};

export const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const toMinutes = (hhmm) => { const [h, m] = hhmm.split(":").map(Number); return h * 60 + m; };

export function formatTime(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}

// "Every Monday, Thursday and Friday, 5:00 PM to 8:00 PM"
export function daysText() {
  const names = LIVE.days.map((d) => DAY_NAMES[d]);
  const list = names.length > 1 ? names.slice(0, -1).join(", ") + " and " + names[names.length - 1] : names[0];
  return `Every ${list}, ${formatTime(LIVE.start)} to ${formatTime(LIVE.end)}`;
}

function nowInSchoolTime() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: LIVE.timezone, weekday: "short", year: "numeric", month: "numeric", day: "numeric",
    hour: "2-digit", minute: "2-digit", hourCycle: "h23"
  }).formatToParts(new Date());
  const get = (type) => parts.find((p) => p.type === type).value;
  return {
    day: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday")),
    year: Number(get("year")), month: Number(get("month")), date: Number(get("day")),
    minutes: Number(get("hour")) * 60 + Number(get("minute"))
  };
}

// { live: true }  or  { live: false, nextLabel: "Thursday" }
export function liveStatus() {
  const now = nowInSchoolTime();
  const start = toMinutes(LIVE.start), end = toMinutes(LIVE.end);
  if (LIVE.days.includes(now.day) && now.minutes >= start && now.minutes < end) return { live: true };
  for (let ahead = 0; ahead <= 7; ahead++) {
    const day = (now.day + ahead) % 7;
    if (!LIVE.days.includes(day)) continue;
    if (ahead === 0 && now.minutes >= start) continue;
    return { live: false, nextLabel: ahead === 0 ? "Today" : ahead === 1 ? "Tomorrow" : DAY_NAMES[day] };
  }
  return { live: false, nextLabel: "Soon" };
}

// The next few class days, for the Live tab
export function upcomingClasses(count = 4) {
  const now = nowInSchoolTime();
  const isLive = liveStatus().live;
  const list = [];
  for (let ahead = 0; ahead <= 21 && list.length < count; ahead++) {
    const day = (now.day + ahead) % 7;
    if (!LIVE.days.includes(day)) continue;
    if (ahead === 0 && now.minutes >= toMinutes(LIVE.end)) continue;
    const date = new Date(Date.UTC(now.year, now.month - 1, now.date + ahead));
    list.push({
      when: ahead === 0 ? "Today" : ahead === 1 ? "Tomorrow" : DAY_NAMES[day],
      date: date.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" }),
      live: ahead === 0 && isLive
    });
  }
  return list;
                                                          }
    
