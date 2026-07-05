export function generateMoodScrollInsight(checkIns) {
  const withBoth = checkIns.filter(
    (c) => c.mood != null && c.reportedScrollHours != null
  );

  if (withBoth.length < 5) {
    return {
      text: 'Keep checking in for a few more days. We need at least 5 entries with mood and scroll data to spot patterns.',
      ready: false,
    };
  }

  const medianScroll = median(withBoth.map((c) => c.reportedScrollHours));
  const lowScrollDays = withBoth.filter((c) => c.reportedScrollHours <= medianScroll);
  const highScrollDays = withBoth.filter((c) => c.reportedScrollHours > medianScroll);

  const avgMoodLow = average(lowScrollDays.map((c) => c.mood));
  const avgMoodHigh = average(highScrollDays.map((c) => c.mood));

  const diff = avgMoodLow - avgMoodHigh;

  if (diff >= 0.5) {
    return {
      text: 'Your lower-scroll days often line up with better mood scores. This is a pattern worth noticing — not proof of cause, but a signal that less scrolling may support how you feel.',
      ready: true,
    };
  }

  if (diff <= -0.5) {
    return {
      text: 'Your mood scores don\'t show a clear link with scroll time yet. That\'s normal — other factors like sleep, stress, and social connection matter too.',
      ready: true,
    };
  }

  return {
    text: 'So far, your mood and scroll time look fairly independent. Keep tracking — patterns sometimes emerge over a few weeks.',
    ready: true,
  };
}

function average(arr) {
  if (!arr.length) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function median(arr) {
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}
