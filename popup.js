document.getElementById('addUrlForm').addEventListener('submit', function(e) {
    e.preventDefault();
  
    const url = document.getElementById('url').value;
    const limit = parseInt(document.getElementById('limit').value);
  
    // Save the URL and limit to chrome storage
    chrome.storage.sync.get('urlTimeLimits', function(data) {
      const urlTimeLimits = data.urlTimeLimits || {};
      urlTimeLimits[url] = limit;
  
      chrome.storage.sync.set({ urlTimeLimits: urlTimeLimits }, function() {
        alert('Website limit added!');
        displayUrlList();
      });
    });
  });
  
  // Display the list of added URLs and time limits
  function displayUrlList() {
    chrome.storage.sync.get('urlTimeLimits', function(data) {
      const urlTimeLimits = data.urlTimeLimits || {};
      const urlListElement = document.getElementById('urlList');
      urlListElement.innerHTML = '';
  
      for (const url in urlTimeLimits) {
        const li = document.createElement('li');
        li.textContent = `${url} - ${urlTimeLimits[url]} minutes/hour`;
        urlListElement.appendChild(li);
      }
    });
  }
  
  // Display the list when the popup is opened
  displayUrlList();
  