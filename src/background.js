// List of URLs to remove prompt=select_account
let listOfAadSso = [
  "https://appcenter.ms/auth/aad/callback",
  "https://loop.microsoft.com/authLanding.html"
] 

// Get AAD signin status
let isAADSIgnedIn = false;
chrome.identity.getProfileUserInfo(function(userInfo) { 
  email = userInfo.email; 
  let officeHRD = "https://odc.officeapps.live.com/odc/v2.1/idp?hm=0&emailAddress=" + email;
  fetch(officeHRD).then(r => r.text()).then(result => {
    if (JSON.parse(result).account == "OrgId,Placeholder") {
      isAADSIgnedIn = true;
    }
  })
});

chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    if (!isAADSIgnedIn) {
      console.log("Not AAD signed in, exit.")
      return { redirectUrl: url.toString()};
    }

    let url = new URL(details.url);
    let params = url.searchParams;
    if (listOfAadSso.includes(params.get("redirect_uri"))) {
      params.delete("prompt");
    }

    return { redirectUrl: url.toString()};
  },
  {urls:["*://login.microsoftonline.com/*/authorize*"]},
  ["blocking"]
);
