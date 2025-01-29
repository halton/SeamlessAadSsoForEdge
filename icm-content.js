// Function to handle the sign in action
function handleSignIn() {
  console.log('handleSignIn function called for ICM Portal');

  // Find element using specific XPath
  const xpath = '/html/body/div/div/div/div[1]/div/div/div[2]/main/div[1]/div[1]/button[1]';
  const matchingElement = document.evaluate(
    xpath,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue;

  if (matchingElement) {
    console.log('Sign in button found, clicking...');
    matchingElement.click();
  } else {
    console.log('Sign in button not found using XPath');
  }
}

// Run when the page loads
console.log('ICM Portal script loaded');
if (document.readyState === 'loading') {
  // Document still loading, add event listener
  document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded event fired');
    setTimeout(() => {
      console.log('Timeout triggered');
      handleSignIn();
    }, 1000);
  });
} else {
  // Document already loaded, run directly
  console.log('Document already loaded');
  setTimeout(() => {
    console.log('Timeout triggered');
    handleSignIn();
  }, 1000);
}

// Also run when URL changes (for single page applications)
let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    setTimeout(handleSignIn, 1000);
  }
}).observe(document, {subtree: true, childList: true});