// Function to handle the sign in action
function handleSignIn() {
  console.log('handleSignIn function called');
  // Check if we're on the App Center homepage
  if (window.location.href === 'https://appcenter.ms/') {
    // Find element using XPath
    const xpath = '//*[@id="hero"]/section/div/div[2]/div/div[1]/a[2]';
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
    return;
  }

  // Check if we're on the sign-in page
  if (window.location.href === 'https://appcenter.ms/sign-in') {
    const xpath = '//*[@id="content"]/div/div[3]/div/div[1]/div[2]/div/a[2]';
    const matchingElement = document.evaluate(
      xpath,
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    ).singleNodeValue;

    if (matchingElement) {
      console.log('Sign in with GitHub button found, clicking...');
      matchingElement.click();
    } else {
      console.log('Sign in with GitHub button not found using XPath');
    }
    return;
  }

  // Get all links on the page
  const links = document.getElementsByTagName('a');

  // Convert HTMLCollection to Array for easier filtering
  const targetLink = Array.from(links).find(link => {
    // Check if the link matches the same position/structure
    return link.closest('#hero') &&
           link.closest('section') &&
           link.closest('div[class*="div"]');
  });

  console.log('asdf')
  if (targetLink) {
    targetLink.click();
    console.log('Button clicked successfully');
  } else {
    console.log('Button not found');
  }
}

// Run when the page loads
console.log('Script loaded');
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