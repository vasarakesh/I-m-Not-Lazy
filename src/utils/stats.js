export function formatDateKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export function getLastNDays(n) {
  const days = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(formatDateKey(d));
  }
  return days;
}

export function computeStreak(checkIns) {
  if (!checkIns.length) return { current: 0, best: 0 };

  const dates = checkIns
    .filter((c) => c.mood || c.morningIntention || c.eveningReflection)
    .map((c) => c.id)
    .sort()
    .reverse();

  if (!dates.length) return { current: 0, best: 0 };

  let current = 0;
  let best = 0;
  let streak = 0;
  const today = formatDateKey();
  const yesterday = formatDateKey(new Date(Date.now() - 86400000));

  const dateSet = new Set(dates);

  if (dateSet.has(today) || dateSet.has(yesterday)) {
    let checkDate = dateSet.has(today) ? new Date() : new Date(Date.now() - 86400000);
    while (dateSet.has(formatDateKey(checkDate))) {
      current++;
      checkDate.setDate(checkDate.getDate() - 1);
    }
  }

  for (const date of dates) {
    streak++;
    const prev = new Date(date);
    prev.setDate(prev.getDate() - 1);
    if (!dateSet.has(formatDateKey(prev))) {
      best = Math.max(best, streak);
      streak = 0;
    }
  }
  best = Math.max(best, streak, current);

  return { current, best };
}

export function computeReclaimedHours(baselineHours, usageLogs, days = 7) {
  if (!baselineHours) return 0;
  const lastDays = getLastNDays(days);
  let totalReclaimed = 0;
  let daysWithData = 0;

  for (const day of lastDays) {
    const log = usageLogs.find((l) => l.id === day);
    if (log) {
      const reclaimed = Math.max(0, baselineHours - log.hours);
      totalReclaimed += reclaimed;
      daysWithData++;
    }
  }

  return daysWithData > 0 ? Math.round(totalReclaimed * 10) / 10 : 0;
}

export function humanEquivalent(hours) {
  if (hours <= 0) return null;

  const books = Math.floor(hours / 6);
  const workouts = Math.floor(hours / 0.75);
  const studySessions = Math.floor(hours / 1.5);

  if (books >= 1) {
    return `About ${books} book${books > 1 ? 's' : ''} worth of reading time`;
  }
  if (workouts >= 2) {
    return `Roughly ${workouts} short workouts`;
  }
  if (studySessions >= 1) {
    return `About ${studySessions} focused study session${studySessions > 1 ? 's' : ''}`;
  }
  return `${Math.round(hours * 60)} minutes you could spend on something that matters to you`;
}

export function getWeekUsageTrend(usageLogs, baselineHours) {
  const days = getLastNDays(7);
  return days.map((day) => {
    const log = usageLogs.find((l) => l.id === day);
    return {
      date: day,
      label: new Date(day + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short' }),
      hours: log ? log.hours : null,
      baseline: baselineHours,
    };
  });
}
