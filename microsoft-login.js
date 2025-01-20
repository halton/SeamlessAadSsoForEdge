// First check the Office endpoint
chrome.identity.getProfileUserInfo(function(userInfo) {
  const email = userInfo.email;
  console.log(email);
  let officeHRD = 'https://odc.officeapps.live.com/odc/v2.1/idp?hm=0&emailAddress=' + email;

  fetch(officeHRD)
    .then(r => r.text())
    .then(result => {
      console.log(JSON.parse(result).account);
      // Do nothing if not an AAD signed in
      if (JSON.parse(result).account !== 'OrgId,Placeholder') {
        return;
      }

      // Existing Microsoft login logic
      chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
        if (changeInfo.url) {
          try {
            let url = new URL(changeInfo.url);
            if (url.hostname === 'login.microsoftonline.com' &&
                url.searchParams.has('prompt') &&
                url.searchParams.get('prompt') === 'select_account') {

              url.searchParams.delete('prompt');
              console.log('Removing prompt parameter, redirecting to:', url.toString());
              chrome.tabs.update(tabId, { url: url.toString() });
            }
          } catch (error) {
            console.error('Error processing URL:', error);
          }
        }
      });
    })
    .catch(error => {
      console.error('Error fetching Office HRD:', error);
    });
}); 