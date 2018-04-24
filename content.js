// This is the content script for the extension
console.log("Investigative Toolbox is running!");
//
// Listen for messages
chrome.runtime.onMessage.addListener(receiver);

// A message from the popup is received
function receiver(request, sender, sendResponse) {
  console.log(request);
  if ("wordCount" in request) {

      var wc = checkWordCount(request["wordCount"]);
      chrome.runtime.sendMessage({
        from:    'content',
        wordCount: wc,
        word: request["wordCount"]
      });
  }
}

function checkWordCount(wordStr) {
  //--- Search for "of" as a whole word.
  var wordRegex = new RegExp("\\b" + wordStr + "\\b", "gi");
  var matchRez = $(document.body).text().match(wordRegex);
  var wordCount = matchRez ? matchRez.length : 0;

  //--- Display the results.
  var countReport = '';
  switch (wordCount) {
    case 0:
      countReport = wordStr + ' was not found!'
      break;
    case 1:
      countReport = wordStr + ' was found one time.'
      break;
    default:
      countReport = wordStr + ' was found ' + wordCount + ' times.'
      break;
  }

  console.log(wordStr + " was found " + wordCount + " times");
  return wordCount;
}
