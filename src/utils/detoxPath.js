const HEAVY_THRESHOLD = 4;

export function generateDetoxPath({ apps, hoursPerDay, reclaimedGoals }) {
  const recommendations = [];
  const isHeavy = hoursPerDay >= HEAVY_THRESHOLD;
  const wantsStudy = reclaimedGoals.includes('study');
  const wantsFitness = reclaimedGoals.includes('fitness');
  const wantsSocial = reclaimedGoals.includes('social');
  const wantsCreative = reclaimedGoals.includes('creative');
  const wantsSleep = reclaimedGoals.includes('sleep');

  if (apps.includes('instagram')) {
    recommendations.push({
      id: 'ig-notifications',
      priority: isHeavy ? 'high' : 'medium',
      text: 'Disable Instagram notification badges and non-DM alerts.',
    });
    if (isHeavy) {
      recommendations.push({
        id: 'ig-feed-friction',
        priority: 'high',
        text: 'Remove Instagram from your home screen. Open only via search when you have a specific reason.',
      });
      recommendations.push({
        id: 'ig-time-limit',
        priority: 'high',
        text: 'Set a 30-minute daily app limit through your phone settings.',
      });
    }
    if (wantsStudy) {
      recommendations.push({
        id: 'ig-study-blocks',
        priority: 'medium',
        text: 'Block Instagram during your two main study windows using Focus mode or app limits.',
      });
    }
  }

  if (apps.includes('tiktok')) {
    recommendations.push({
      id: 'tt-autoscroll',
      priority: 'high',
      text: 'Log out of TikTok when not actively posting. The friction of re-login reduces mindless opens.',
    });
    if (isHeavy) {
      recommendations.push({
        id: 'tt-remove-icon',
        priority: 'high',
        text: 'Move TikTok off your home screen entirely for two weeks.',
      });
    }
  }

  if (apps.includes('youtube')) {
    recommendations.push({
      id: 'yt-autoplay',
      priority: 'high',
      text: 'Turn off autoplay and hide Shorts from your feed.',
    });
    if (wantsFitness) {
      recommendations.push({
        id: 'yt-evening-cutoff',
        priority: 'medium',
        text: 'Set a 9 PM YouTube cutoff. Swap evening scroll time for a 20-minute workout.',
      });
    }
    if (wantsSleep) {
      recommendations.push({
        id: 'yt-bedtime',
        priority: 'high',
        text: 'No YouTube in bed. Charge your phone outside the bedroom.',
      });
    }
  }

  if (apps.includes('twitter') || apps.includes('reddit')) {
    recommendations.push({
      id: 'feed-cleanup',
      priority: 'medium',
      text: 'Unfollow or mute accounts that trigger endless scrolling without adding value.',
    });
  }

  if (apps.includes('snapchat')) {
    recommendations.push({
      id: 'snap-streaks',
      priority: 'medium',
      text: 'Let streaks expire naturally. They are designed to create daily obligation, not connection.',
    });
  }

  if (wantsStudy && isHeavy) {
    recommendations.push({
      id: 'time-blocks',
      priority: 'high',
      text: 'Block two 90-minute focused study windows daily. Keep your phone in another room during them.',
    });
  }

  if (wantsSocial) {
    recommendations.push({
      id: 'real-social',
      priority: 'medium',
      text: 'Schedule one in-person hangout per week. Replace passive feed scrolling with active connection.',
    });
  }

  if (wantsCreative) {
    recommendations.push({
      id: 'create-dont-consume',
      priority: 'medium',
      text: 'Spend 30 minutes creating (writing, drawing, music) before opening any social app each day.',
    });
  }

  if (wantsSleep) {
    recommendations.push({
      id: 'phone-free-hour',
      priority: 'high',
      text: 'Keep your phone out of reach for the hour before bed.',
    });
  }

  if (recommendations.length === 0) {
    recommendations.push({
      id: 'general-awareness',
      priority: 'medium',
      text: 'Track your daily scroll time for one week to build awareness before making changes.',
    });
  }

  const pathTitle = isHeavy
    ? 'High-friction reduction path'
    : hoursPerDay >= 2
      ? 'Gradual reclaim path'
      : 'Maintenance and awareness path';

  return {
    id: `path-${Date.now()}`,
    title: pathTitle,
    summary: `Based on ~${hoursPerDay}h/day across ${apps.map(formatApp).join(', ')}.`,
    recommendations,
    generatedAt: new Date().toISOString(),
  };
}

function formatApp(app) {
  const names = {
    instagram: 'Instagram',
    tiktok: 'TikTok',
    youtube: 'YouTube',
    twitter: 'X/Twitter',
    reddit: 'Reddit',
    snapchat: 'Snapchat',
    facebook: 'Facebook',
    other: 'other apps',
  };
  return names[app] || app;
}
