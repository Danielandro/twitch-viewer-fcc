let userList = document.querySelector('.list-of-users'); // unordered list for users
let twitchApi = 'https://wind-bow.glitch.me/twitch-api';

let streams = `${twitchApi}/streams/`;
let channels = `${twitchApi}/channels/`;

let arrayOfRoutes = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"].map((user) => {
    a = `${streams}${user}`,
        b = `${channels}${user}`;
    return [a, b];
});

let calls = (streamsUrl, channelsUrl) => {
    // call to streams
    new Promise((resolve, reject) => {
        resolve(fetch(streamsUrl));
    }).then((res) => res.json())
        .then((data) => {
            let stream = data;
            // call to channels
            new Promise((resolve, reject) => {
                resolve(fetch(channelsUrl));
            }).then((res) => res.json())
                .then((data2) => {
                    let channel = data2;

                    // from users
                    let displayName = channel.display_name; // users display name
                    let userLogo = channel.logo; // user logo

                    // from channels
                    let gameDescription = channel.game + ' - ' + channel.status; // string of game & stream description
                    let userUrl = channel.url; // users' twitch url  

                    //from streams
                    if (stream.stream === null) {        // IF USER IS OFFLINE        
                        let offline = 'offline';
                        let red = '#B20000';
                        createNode(displayName, userLogo, offline, red, userUrl, gameDescription);
                    }
                    else {
                        let online = 'online';
                        let green = '#00B200';
                        createNode(displayName, userLogo, online, green, userUrl, gameDescription);
                    }

                }).catch((err) => {
                    console.log('Error', err);
                })
        })

}

let createNode = ((displayName, userLogo, streamStatus, statusColor, userUrl, gameDescription) => {
    let listNode = document.createElement('LI'); // create a list node

    let userLink = document.createElement('A'); // create a hyperlink element
    userLink.setAttribute('href', userUrl); // set destination for link
    userLink.setAttribute('target', '_blank'); // open link in a new page

    let imgNode = document.createElement('IMG'); // create node for logo
    imgNode.setAttribute('src', userLogo); // set href of img

    let displayNameNode = document.createTextNode(displayName); // create name text node
    userLink.appendChild(imgNode); // append logo as child of A element
    userLink.appendChild(displayNameNode); // append display name as child of A element

    let textNode = document.createElement('P'); // create node for user stream description
    let userDescription = document.createTextNode(gameDescription); // create text node of user description 
    textNode.appendChild(userDescription); // add stream description to p element    
    textNode.classList.add('feed'); // add feed class to user desc

    let para = document.createElement('P'); // create node for online/offline status
    let createStatus = document.createTextNode(streamStatus); // create text node - OFFLINE      
    para.appendChild(createStatus); // append offline to new paragraph    
    para.style.color = statusColor; // set status text color  

    listNode.appendChild(userLink); // append hyperlink to list (contains Logo & display name)
    listNode.appendChild(textNode); // append stream description 
    listNode.appendChild(para); // append stream status

    userList.appendChild(listNode); // append li to unordered list    
});

arrayOfRoutes.forEach((linkArray) => {
    calls(linkArray[0], linkArray[1]);

});

