(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var STORAGE_KEY = 'imnotlazy-control-checks';

  var GOAL_SWAPS = {
    study: {
      title: 'Study or skill practice',
      perHour: 'One deep study block (~50–60 min focus + short break)',
      build: function (hours) {
        var blocks = Math.max(1, Math.round(hours));
        return blocks + ' focused study block' + (blocks > 1 ? 's' : '') + ' — enough to finish a chapter, lecture, or language lesson set';
      }
    },
    build: {
      title: 'Build something',
      perHour: 'A real progress session on a project',
      build: function (hours) {
        if (hours >= 3) {
          return 'A solid build session: ship a feature, finish a portfolio piece, or get a side project past the “idea” stage';
        }
        return 'A focused build session — outline, prototype, or finish one concrete piece of a project';
      }
    },
    fitness: {
      title: 'Move your body',
      perHour: '~45–60 minutes of movement',
      build: function (hours) {
        var workouts = Math.max(1, Math.floor(hours / 0.75));
        return 'Roughly ' + workouts + ' short workout' + (workouts > 1 ? 's' : '') + ' or a long walk plus mobility work';
      }
    },
    create: {
      title: 'Create instead of consume',
      perHour: 'A creative practice block',
      build: function (hours) {
        return 'Time to write, draw, compose, or edit — produce something of your own for about ' + formatHours(hours);
      }
    },
    social: {
      title: 'Real-world connection',
      perHour: 'An intentional hangout or call',
      build: function (hours) {
        if (hours >= 2) {
          return 'A real hangout, coffee, or long catch-up instead of passive feed surfing';
        }
        return 'A deliberate call or walk with someone you care about';
      }
    },
    sleep: {
      title: 'Protect your sleep',
      perHour: 'Wind-down without screens',
      build: function (hours) {
        return 'A phone-free wind-down — reading, stretching, or earlier lights-out for about ' + formatHours(hours);
      }
    },
    work: {
      title: 'Deep work',
      perHour: 'Uninterrupted career focus',
      build: function (hours) {
        var sessions = Math.max(1, Math.floor(hours / 1.5));
        return 'About ' + sessions + ' deep-work session' + (sessions > 1 ? 's' : '') + ' on the tasks that actually move your career forward';
      }
    }
  };

  var CATEGORY_LABELS = {
    all: 'All options',
    feed: 'Chronological feeds',
    algorithm: 'Algorithm resets',
    friction: 'Friction & muting',
    limits: 'Time limits'
  };

  function formatHours(hours) {
    if (hours === 1) return '1 hour';
    if (Number.isInteger(hours)) return hours + ' hours';
    return hours + ' hours';
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function loadChecks() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    } catch (e) {
      return {};
    }
  }

  function saveChecks(map) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
    } catch (e) { /* ignore quota / private mode */ }
  }

  /* ---------- Mobile nav ---------- */

  function initNav() {
    var toggle = document.querySelector('.menu-toggle');
    var nav = document.getElementById('site-nav');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Calculator ---------- */

  function syncHourInputs(value) {
    var hoursInput = document.getElementById('hours');
    var range = document.getElementById('hours-range');
    var clamped = Math.min(24, Math.max(0, value));
    if (hoursInput) hoursInput.value = String(clamped);
    if (range) range.value = String(Math.min(12, clamped));

    document.querySelectorAll('.chip[data-hours]').forEach(function (chip) {
      chip.classList.toggle('is-active', parseFloat(chip.getAttribute('data-hours')) === clamped);
    });
  }

  function buildResultMessage(hours, learned, intentional, goals) {
    var wasted = learned === 'no' && intentional === 'no';
    var mixed = learned === 'somewhat' || (learned === 'yes' && intentional === 'no') || (learned === 'no' && intentional === 'yes');
    var selectedGoals = goals.length ? goals : ['study', 'build'];

    var eyebrow;
    var headline;
    var lead;
    var reassurance;

    if (wasted) {
      eyebrow = 'Unintentional scroll time';
      headline = 'Those ' + formatHours(hours) + ' could have gone toward something meaningful.';
      lead = 'You said you didn’t learn much and weren’t following through on anything intentional. That’s common — and noticing it is already a step. Here’s what the same amount of time can look like when you slowly redirect it.';
      reassurance = 'It’s okay for today. You’re not behind and you don’t need to overhaul everything tonight. Next time you open an app, try to follow something useful, learn one small thing, or spend even part of that window on something that matters to you.';
    } else if (mixed) {
      eyebrow = 'Mixed return on attention';
      headline = 'Keep the useful part. Gently reclaim the rest of the ' + formatHours(hours) + '.';
      lead = 'Some of that session may have been worthwhile — and that’s fine. Habit scrolling still took a share you could slowly move toward skill, health, or projects. The swaps below are invitations, not demands.';
      reassurance = 'It’s okay for today. Change sticks when it’s gradual. Tomorrow, try to follow something useful for a bit longer — or notice one moment where you choose a meaningful alternative instead.';
    } else {
      eyebrow = 'Intentional use';
      headline = 'Nice — you got something out of those ' + formatHours(hours) + '.';
      lead = 'When a session is purposeful, it counts. Keep building that muscle: open apps with a reason, follow through on something useful, and let empty scrolls get rarer over time.';
      reassurance = 'It’s okay to keep refining this slowly. You’re changing how you use attention — not punishing yourself for imperfect days.';
    }

    var swaps = selectedGoals.slice(0, 4).map(function (id) {
      var goal = GOAL_SWAPS[id];
      if (!goal) return '';
      return (
        '<div class="swap">' +
          '<strong>' + escapeHtml(goal.title) + '</strong>' +
          '<span>' + escapeHtml(goal.build(hours)) + '</span>' +
        '</div>'
      );
    }).join('');

    var weekly = Math.round(hours * 7 * 10) / 10;
    var next = 'When you’re ready, <a href="#controls">explore feed controls</a> — one small platform tweak at a time is enough.';

    return (
      '<p class="calc-results__eyebrow' + (wasted ? '' : ' is-good') + '">' + escapeHtml(eyebrow) + '</p>' +
      '<h3>' + escapeHtml(headline) + '</h3>' +
      '<p class="calc-results__lead">' + escapeHtml(lead) + '</p>' +
      '<div class="swap-grid">' + swaps + '</div>' +
      '<p class="calc-results__lead">At this daily pace, that’s about <strong>' + escapeHtml(String(weekly)) + ' hours per week</strong> — enough to make visible progress on a skill or project if even a portion gets redirected over time.</p>' +
      '<p class="calc-results__reassure">' + escapeHtml(reassurance) + '</p>' +
      '<p class="calc-results__next">' + next + '</p>'
    );
  }

  function initCalculator() {
    var form = document.getElementById('time-calculator');
    var results = document.getElementById('calc-results');
    var hoursInput = document.getElementById('hours');
    var range = document.getElementById('hours-range');
    if (!form || !results || !hoursInput || !range) return;

    hoursInput.addEventListener('input', function () {
      syncHourInputs(parseFloat(hoursInput.value) || 0);
    });

    range.addEventListener('input', function () {
      syncHourInputs(parseFloat(range.value) || 0);
    });

    document.querySelectorAll('.chip[data-hours]').forEach(function (chip) {
      chip.addEventListener('click', function () {
        syncHourInputs(parseFloat(chip.getAttribute('data-hours')));
      });
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var hours = parseFloat(hoursInput.value);
      if (Number.isNaN(hours) || hours < 0) {
        hoursInput.focus();
        return;
      }

      var learned = (form.querySelector('input[name="learned"]:checked') || {}).value || 'no';
      var intentional = (form.querySelector('input[name="intentional"]:checked') || {}).value || 'no';
      var goals = Array.prototype.map.call(
        form.querySelectorAll('input[name="goals"]:checked'),
        function (el) { return el.value; }
      );

      results.hidden = false;
      results.innerHTML = buildResultMessage(hours, learned, intentional, goals);
      results.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'nearest' });
    });
  }

  /* ---------- Platform controls ---------- */

  function initControls() {
    var tabsRoot = document.getElementById('platform-tabs');
    var panel = document.getElementById('platform-panel');
    if (!tabsRoot || !panel) return;

    fetch('controls.json')
      .then(function (res) {
        if (!res.ok) throw new Error('Failed to load controls');
        return res.json();
      })
      .then(function (data) {
        var platforms = data.platforms || [];
        var checks = loadChecks();
        var activeId = platforms[0] ? platforms[0].id : null;
        var activeFilter = 'all';

        function renderTabs() {
          tabsRoot.innerHTML = platforms.map(function (p) {
            var selected = p.id === activeId;
            return (
              '<button type="button" class="platform-tab" role="tab" data-platform="' + escapeHtml(p.id) + '"' +
              ' aria-selected="' + (selected ? 'true' : 'false') + '">' +
              escapeHtml(p.title) +
              '</button>'
            );
          }).join('');
        }

        function renderPanel() {
          var platform = platforms.find(function (p) { return p.id === activeId; }) || platforms[0];
          if (!platform) {
            panel.innerHTML = '<p>Controls could not load.</p>';
            return;
          }

          var categories = ['all'];
          platform.controls.forEach(function (c) {
            if (categories.indexOf(c.category) === -1) categories.push(c.category);
          });
          if (categories.indexOf(activeFilter) === -1) activeFilter = 'all';

          var filters = categories.map(function (cat) {
            return (
              '<button type="button" class="filter-chip' + (cat === activeFilter ? ' is-active' : '') + '" data-filter="' + escapeHtml(cat) + '">' +
              escapeHtml(CATEGORY_LABELS[cat] || cat) +
              '</button>'
            );
          }).join('');

          var list = platform.controls
            .filter(function (c) { return activeFilter === 'all' || c.category === activeFilter; })
            .map(function (c) {
              var key = platform.id + ':' + c.id;
              var done = !!checks[key];
              return (
                '<label class="control-item' + (done ? ' is-done' : '') + '">' +
                  '<input type="checkbox" data-check="' + escapeHtml(key) + '"' + (done ? ' checked' : '') + ' />' +
                  '<div>' +
                    '<div class="control-item__title">' + escapeHtml(c.title) + '</div>' +
                    '<div class="control-item__body">' + escapeHtml(c.body) + '</div>' +
                    '<span class="control-item__tag">' + escapeHtml(CATEGORY_LABELS[c.category] || c.category) + '</span>' +
                  '</div>' +
                '</label>'
              );
            }).join('');

          panel.innerHTML =
            '<h3>' + escapeHtml(platform.title) + '</h3>' +
            '<p class="platform-panel__summary">' + escapeHtml(platform.summary) + '</p>' +
            '<div class="filter-row" role="group" aria-label="Filter control types">' + filters + '</div>' +
            '<div class="control-list">' + (list || '<p>No options in this category.</p>') + '</div>';
        }

        function bindCheckboxes(root) {
          root.querySelectorAll('input[data-check]').forEach(function (input) {
            input.addEventListener('change', function () {
              checks[input.getAttribute('data-check')] = input.checked;
              saveChecks(checks);
              var item = input.closest('.control-item');
              if (item) item.classList.toggle('is-done', input.checked);
            });
          });
        }

        tabsRoot.addEventListener('click', function (event) {
          var btn = event.target.closest('[data-platform]');
          if (!btn) return;
          activeId = btn.getAttribute('data-platform');
          activeFilter = 'all';
          renderTabs();
          renderPanel();
          bindCheckboxes(panel);
        });

        panel.addEventListener('click', function (event) {
          var filterBtn = event.target.closest('[data-filter]');
          if (!filterBtn) return;
          activeFilter = filterBtn.getAttribute('data-filter');
          renderPanel();
          bindCheckboxes(panel);
        });

        renderTabs();
        renderPanel();
        bindCheckboxes(panel);
      })
      .catch(function () {
        panel.innerHTML = '<p>Platform controls could not load. Check that <code>controls.json</code> is available.</p>';
      });
  }

  /* ---------- Scroll reveal ---------- */

  function initReveal() {
    var nodes = document.querySelectorAll('.section, .insight, .calc__step');
    nodes.forEach(function (el, i) {
      el.classList.add('reveal');
      el.style.setProperty('--reveal-delay', ((i % 4) * 70) + 'ms');
    });

    if (prefersReducedMotion) {
      nodes.forEach(function (el) { el.classList.add('reveal--visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

    nodes.forEach(function (el) { observer.observe(el); });
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.documentElement.classList.add('js-ready');
    initNav();
    initCalculator();
    initControls();
    initReveal();
  });
})();
