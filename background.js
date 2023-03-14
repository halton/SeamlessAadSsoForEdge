
// background.js

// List of URLs to remove prompt=select_account
// TODO（halton): Use this list to add rule one by one
const listOfAadSso = [
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

    // Remove rules first
    chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: [1, 2]
    });

    const rules = [
      {
        "id": 1,
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
          "regexFilter": "^https://login\.microsoftonline\.com/.*/authorize\?(&|.*)redirect_uri=" + encodeURI('https://appcenter.ms/auth/aad/callback'),
          "resourceTypes": ["main_frame"]
        }
      },
      {
        "id": 2,
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
          "regexFilter": "^https://login\.microsoftonline\.com/.*/authorize\?(&|.*)redirect_uri=" + encodeURI('https://loop.microsoft.com/authLanding.html'),
          "resourceTypes": ["main_frame"]
        }
      }
    ];

    chrome.declarativeNetRequest.updateDynamicRules({
      addRules: rules,
      removeRuleIds: []
    });
  })
});
