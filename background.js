// background.js

// List of URLs to remove prompt=select_account
const noPromptURLs = [
  'https://appcenter.ms/auth/aad/callback',
  'https://loop.microsoft.com/authLanding.html]'
]

// Get AAD signin status
chrome.identity.getProfileUserInfo(function(userInfo) {
  email = userInfo.email;
  let officeHRD = 'https://odc.officeapps.live.com/odc/v2.1/idp?hm=0&emailAddress=' + email;
  fetch(officeHRD).then(r => r.text()).then(result => {
    // Do nothing is not an AAD signed in
    if (JSON.parse(result).account !== 'OrgId,Placeholder') {
      return;
    }

    // Cleanup the rules first
    chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: noPromptURLs.map((element, index) => index + 1)
    });

    const rules = noPromptURLs.map((element, index) => {
      return {
        "id": index + 1,
        "priority": 1,
        "action": {
          "type": "redirect",
          "redirect": {
            "transform": {
              "queryTransform": {
                "removeParams": [ "prompt" ]
              }
            }
          }
        },
        "condition": {
          "regexFilter": "^https://login\.microsoftonline\.com/.*/authorize\?(&|.*)redirect_uri=" + encodeURI(element),
          "resourceTypes": ["main_frame"]
        }
      }
    })

    chrome.declarativeNetRequest.updateDynamicRules({
      addRules: rules
    });
  })
});
