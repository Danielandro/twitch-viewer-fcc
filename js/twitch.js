window.onload = function () {

var arrayOfUsers = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"];
var userList = document.querySelector('.list-of-users'); // unordered list for users
var apiUrl = 'https://wind-bow.glitch.me/twitch-api'; // base twitch url
var channels = apiUrl + '/channels/'; // channels route
var users = apiUrl + '/users/'; // users route
var streams = apiUrl + '/streams/'; // streams route    

// call to USERS - grab logo & display_name => then callToStreams
function callToUsers(apiStream, arrayPosition, streamsRoute, channelRoute) {
    fetch(apiStream + arrayOfUsers[arrayPosition]).then(function (response) {
        if (response.status != 200) {
            console.log('There was a problem with the request - ' + response.status); // error case
            return;
        };
        response.json().then(function (usersJson) {
            var displayName = usersJson.display_name; // users display name
            var userLogo = usersJson.logo; // user logo
            callToStreams(streamsRoute, arrayPosition, displayName, userLogo, channelRoute); // PASS: STREAM URL, CURRENT ARRAY POSITION, DISPLAY NAME & LOGO, CHANNELS URL TO STREAM ROUTE                       
        })
    }).catch(function (err) {
        console.log('There was an error fetching that resource', err)
    })
}

// call to STREAMS - check users online/offline status => then callToChannels
function callToStreams(apiStream, arrayPosition, displayName, userLogo, channelRoute) {
    fetch(apiStream + arrayOfUsers[arrayPosition]).then(function (response) {
        if (response.status != 200) {
            console.log('There was a problem with the request - ' + response.status); // error case
            return;
        };
        response.json().then(function (jsonStream) {
            if (jsonStream.stream === null) {        // IF USER IS OFFLINE        
                var offline = 'offline';
                var red = '#B20000';                
                callToChannels(channelRoute, arrayPosition, displayName, userLogo, offline, red); // PASS: CHANNELS URL, CURRENT ARRAY POSITION, DISPLAY NAME/LOGO, OFFLINE, RED             
            }
            else {
                var online = 'online';
                var green = '#00B200';
                callToChannels(channelRoute, arrayPosition, displayName, userLogo, online, green); // PASS: CHANNELS URL, CURRENT ARRAY POSITION, DISPLAY NAME/LOGO, ONLINE, GREEN                
            }
        })
    }).catch(function (err) {
        console.log('There was an error fetching that resource', err)
    })
}

// call to CHANNELS - grab users description & url => then call create nodes 
function callToChannels(apiStream, arrayPosition, displayName, userLogo, streamStatus, statusColor) {
    fetch(apiStream + arrayOfUsers[arrayPosition]).then(function (response) {
        if (response.status != 200) {
            console.log('There was a problem with the request - ' + response.status); // error case
            return;
        };
        response.json().then(function (jsonChannel) {
            var gameDescription = jsonChannel.game + ' - ' + jsonChannel.status; // string of game & stream description
            var userUrl = jsonChannel.url; // users' twitch url            
            createNode(displayName, userLogo, streamStatus, statusColor, userUrl, gameDescription); // PASS: DISPLAY NAME/LOGO, ONLINE OR OFFLINE, RED OR GREEN, URL TO USER PAGE, STREAM DESCRIPTION            
        })
    }).catch(function (err) {
        console.log('There was an error fetching that resource', err)
    })
}


// create nodes and display info on the page
function createNode(displayName, userLogo, streamStatus, statusColor, userUrl, gameDescription) {  
    var listNode = document.createElement('LI'); // create a list node

    var userLink = document.createElement('A'); // create a hyperlink element
    userLink.setAttribute('href', userUrl); // set destination for link
    userLink.setAttribute('target', '_blank'); // open link in a new page

    var imgNode = document.createElement('IMG'); // create node for logo
    imgNode.setAttribute('src', userLogo); // set href of img

    var displayNameNode = document.createTextNode(displayName); // create name text node
    userLink.appendChild(imgNode); // append logo as child of A element
    userLink.appendChild(displayNameNode); // append display name as child of A element

    var textNode = document.createElement('P'); // create node for user stream description
    var userDescription = document.createTextNode(gameDescription); // create text node of user description 
    textNode.appendChild(userDescription); // add stream description to p element    
    textNode.classList.add('feed'); // add feed class to user desc
      
    var para = document.createElement('P'); // create node for online/offline status
    var createStatus = document.createTextNode(streamStatus); // create text node - OFFLINE      
    para.appendChild(createStatus); // append offline to new paragraph    
    para.style.color = statusColor; // set status text color  
    
    listNode.appendChild(userLink); // append hyperlink to list (contains Logo & display name)
    listNode.appendChild(textNode); // append stream description 
    listNode.appendChild(para); // append stream status

    userList.appendChild(listNode); // append li to unordered list    
}

function apiSearch(user, channel, stream) {     
    for (var i = 0; i < arrayOfUsers.length; i++) {
        callToUsers(user, i, stream, channel); // call with users route, current array position, stream route, channel route      
    };
};

apiSearch(users, channels, streams); // call api using all three routes

}