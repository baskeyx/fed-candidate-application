require(['lib/mustache.min'], function(Mustache) {
    var PRODUCTIONS_URL = 'http://discovery.hubsvc.itv.com/platform/itvonline/browser/productions?programmeId=L0768&broadcaster=itv';
    var HEADER = {'Accept': 'application/vnd.itv.hubsvc.production.v3+hal+json; charset=UTF-8'};

    getFeed(PRODUCTIONS_URL, success, error, HEADER);

    const PROGRAMMES_URL = 'http://discovery.hubsvc.itv.com/platform/itvonline/browser/programmes/L0768?broadcaster=itv';
    const PROG_HEADER = {'Accept': 'application/vnd.itv.hubsvc.programme.v3+hal+json; charset=UTF-8'};

    getFeed(PROGRAMMES_URL, successProg, error, PROG_HEADER);

    function successProg(response) {
      const jsonResponse = JSON.parse(response);
      const title = jsonResponse.title;
      const synopsis = jsonResponse.synopses.epg;
      const episodeCount = jsonResponse._embedded.productions.count;
      const channel = jsonResponse._embedded.latestProduction._embedded.channel.name;

      const topProgramme = `
        <div class="latest__channel">
          ${channel}
        </div>
        <div class="latest__details">
          <h2>${title}</h2>
          <span>${synopsis}</span>
        </div>
        <div class="latest__episodes">
          ${episodeCount} episode(s) available to watch
        </div>
      `;

      document.querySelector("#latest").innerHTML = topProgramme;

    }

    function success(response) {
        var jsonResponse = JSON.parse(response);
        var productions = (jsonResponse && jsonResponse._embedded) ? jsonResponse._embedded.productions : [];
        var episodeCount = productions.length;

        let episodeSplit = {};

        var episodes = [];
        var synopses, imagePath, image, imageMd, imageLg, episode, broadcasting;

        for (var i = 0; i < episodeCount; i++) {
            synopses = productions[i].synopses.ninety;
            imagePath = productions[i]._links.image.href;
            image = imagePath.replace(/{width}/, '575').replace(/{quality}/, '85');
            imageMd = imagePath.replace(/{width}/, '360').replace(/{quality}/, '85');
            imageLg = imagePath.replace(/{width}/, '600').replace(/{quality}/, '85');
            episode = jsonResponse._embedded.productions[i].series;
            broadcasting = new Date(jsonResponse._embedded.productions[i].broadcastDateTime.commissioning);

            // create a new object for each series and push each episode into an array
            if(typeof episodeSplit[episode] === 'undefined'){
              episodeSplit[episode] = [];
            }
            else{
              episodeSplit[episode].push(jsonResponse._embedded.productions[i]);
            }

            episodes[i] = {
                'synopses': synopses,
                'image': image,
                'imageMd' : imageMd,
                'imageLg': imageLg,
                'episode': episode,
                'broadcasting': broadcasting
            };
        }

        console.log(episodeSplit);

        // Create a json with the required information only to be used by the Mustache template
        var jsonFeed = {
            'episodes': episodes
        };

        render(document.getElementById('template'), jsonFeed, document.getElementById('target'));

    }

    function error(e) {
        console.log('Error: ',e);
    }

    function getFeed(url, onSuccess, onError, headers) {
        var request = new XMLHttpRequest();
        request.open('GET', url, true);

        if (headers) {
            for (var key in headers) {
                request.setRequestHeader(key, headers[key]);
            }
        }

        request.addEventListener('load', function (event) {
            var xhr = event.target;
            if (xhr.status >= 200 && xhr.status < 400) {
                onSuccess(xhr.responseText);
            } else {
                if (onError) {
                    onError(event);
                }
            }
        });

        request.addEventListener('error',function (event) {
            if (onError) {
                onError(event);
            }
        });

        request.send();
    }

    function render(templateElement, json, targetElement) {
        var template = templateElement.innerHTML;
        Mustache.parse(template);
        targetElement.innerHTML = Mustache.render(template, json);
    }
});
