function setup() {
  noCanvas();


  document.getElementById("submitButton").addEventListener("click", startSave);
  document.getElementById("submitButton2").addEventListener("click", dl);
  document.getElementById("submitButton3").addEventListener("click", clear);

  function startSave() {
    window.close();

    // A tab has be selected for the message to be sent
    var params = {
      active: true,
      currentWindow: true
    }
    // This searches for the active tabs in the current window
    chrome.tabs.query(params, gotTabs);

    // Now we've got the tabs
    function gotTabs(tabs) {
      var currentTab = tabs[0].url;
      var word = $( "#word" ).val();
      // The first tab is the one you are on
      chrome.tabs.sendMessage(tabs[0].id, {wordCount: word});
      // Messages are just objects
    }
  }

function dl(){
  chrome.storage.local.get(null, function(items) { // null implies all items
    // Convert object to a string.
    console.log(items);


    ////////////////////////////// JSON TO CSV
    var csvstring = "";

    // this adds the CSV headers
    csvstring += Object.keys(items[Object.keys(items)[0]]).join(",") + "\n"

    // this adds each csvline for each entry in items
    Object.keys(items).forEach(function(url) {
    	var rowstring = "";
      rowstring += Object.values(items[url]).join(",");
    	csvstring += rowstring + "\n";
    });

    // Save as file
    var url = 'data:application/csv;base64,' + btoa(csvstring);
    chrome.downloads.download({
        url: url,
        filename: 'data.csv'
    });

  });

  }

  function clear(){
    chrome.storage.local.clear(function() {
    var error = chrome.runtime.lastError;
    if (error) {
        console.error(error);
    }
    });
  }

  chrome.runtime.onMessage.addListener(receiver);

  // A message from the popup is received
  function receiver(request, sender, sendResponse) {
    console.log(request);
    if ("wordCount" in request) {
        var wc = request["wordCount"];
        var w = request["word"];
        saveInBg(wc,w);
    }
  }

  function saveInBg(wc,w) {
    var params = {
      active: true,
      currentWindow: true
    }
    chrome.tabs.query(params, gotTabs);
    function gotTabs(tabs) {
      var currentTab = tabs[0].url;
      var pageData = {};
      pageData['url'] = currentTab;
      pageData['Word-count'] = wc;
      $(".inputs input").each(function(i, d) {
        pageData[$(d).attr("name")] = $(d).val();
      });
        console.log(pageData);
      chrome.runtime.sendMessage(pageData);
    }
  }


}
