let urlTimeLimits = {}; // Store URLs and their respective time limits
let currentTimes = {}; // Store current time spent on each website
let blockedWebsites = {}; // Track blocked websites per hour

chrome.storage.sync.get('urlTimeLimits', function(data) {
  if (data.urlTimeLimits) {
    urlTimeLimits = data.urlTimeLimits;
  }
});

chrome.alarms.create('resetHour', { when: getNextHourTime() });

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'resetHour') {
    resetAllLimits();
  }
});

chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  const url = new URL(details.url);
  const domain = url.hostname;

  if (blockedWebsites[domain]) {
    chrome.tabs.update(details.tabId, { url: chrome.runtime.getURL("blocked.html") });
  }
}, { url: [{ hostContains: '.' }] });

function getNextHourTime() {
  let now = new Date();
  let nextHour = new Date(now.setHours(now.getHours() + 1, 0, 0, 0)).getTime();
  return nextHour;
}

function checkTimeLimit(tab) {
  const url = new URL(tab.url);
  const domain = url.hostname;

  if (urlTimeLimits[domain]) {
    const timeLimit = urlTimeLimits[domain];
    
    if (!currentTimes[domain]) {
      currentTimes[domain] = 0;
    }

    currentTimes[domain] += 1;

    if (currentTimes[domain] >= timeLimit && !blockedWebsites[domain]) {
      blockedWebsites[domain] = true;
      alert(`Time limit exceeded for ${domain}`);
    }
  }
}

function resetAllLimits() {
  currentTimes = {};
  blockedWebsites = {};
  console.log('Limits reset for the new hour.');
}

function updateUrlTimeLimits(url, limit) {
  chrome.storage.sync.get('urlTimeLimits', function(data) {
    const urlTimeLimits = data.urlTimeLimits || {};
    urlTimeLimits[url] = limit;
    chrome.storage.sync.set({ urlTimeLimits: urlTimeLimits });
  });
}
