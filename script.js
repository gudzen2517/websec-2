class Tag_map {
    constructor(stop_id, label, longitude, latitude) {
        this.stop_id = stop_id
        this.label = label
        this.longitude = longitude
        this.latitude = latitude
    }
}

class TransportStop {
    constructor(type, number, KR_ID, time) {
        this.type = type
        this.number = number
        this.KR_ID = KR_ID
        this.time = time
    }
}

window.addEventListener("load", function (event) {
    const key = '9EQyfpsOwIW5xnBcmyXI';
        const mainmap = new maplibregl.Map({
            container: 'map',
            style: `https://api.maptiler.com/maps/streets/style.json?key=${key}`, // style URL
            center: [50.121, 53.211],
            zoom: 11,
        });

        getInformation().then((stops) => 
        {
            for (let i = 0; i < stops.length; i++) {
                var popup = new maplibregl.Popup({ offset: 25 }).setHTML(
                    `<a href="stop.html?stopid=${stops[i].stop_id}&label=${stops[i].label}">${stops[i].label}</a>`
                );
                var el = document.createElement('div');
                el.id = 'marker';
                
                new maplibregl.Marker(el)
                    .setLngLat([stops[i].longitude, stops[i].latitude])
                    .setPopup(popup)
                    .addTo(mainmap);
            }
        });
        autocomplete(document.getElementById("myInput"));
  });


async function loadStops()
{
    let url = "https://tosamara.ru/api/v2/classifiers/stopsFullDB.xml";

    try 
    {
        let result = await fetch(url).then(response => response.text()).then(str => 
        {
            let parser = new window.DOMParser();
            return parser.parseFromString(str, "text/xml")
        });
        return result;
    }
    catch (err) 
    { 
        console.log('err:', err); 
    }
}

async function getInformation() 
{
    const data = await loadStops();

    let size = data.getElementsByTagName("stop").length;
    let stop_data = data.getElementsByTagName("stop");

    let lst = new Array();

    for (let i = 0; i < size; i++) 
    {
        lst.push(new Tag_map(stop_data[i].childNodes[0].textContent,
            stop_data[i].childNodes[1].textContent + '\r\n'
            + stop_data[i].childNodes[2].textContent + '\n'
            + stop_data[i].childNodes[3].textContent,
            stop_data[i].childNodes[24].textContent,
            stop_data[i].childNodes[23].textContent));
    }

    if (lst.size === 0) 
    {
      lst = "Empty list";
      console.log("Empty list")
    }
    LOADED_STOPS = lst;
    return await Promise.resolve(lst);
}

async function Route(hullNo, ListStops) 
{
    getInformation().then(async (stops) => 
    {
        let URL =`https://tosamara.ru/api/v2/xml?method=getTransportPosition&HULLNO=${hullNo}&os=android&clientid=test&authkey=${sha1(hullNo + "just_f0r_tests")}`    
        let result = await fetch(URL)
        
        .then( response => response.text() ).then( str => 
        {
            let parser = new window.DOMParser();
            return parser.parseFromString(str, "text/xml") 
        });
        
        let innerElement = [];
        let KS_ID = 0;
        
        result = result.getElementsByTagName("nextStops")[0].getElementsByTagName("stop");
        
        for (let i = 0; i < result.length; i++)
        {
            KS_ID = result[i].getElementsByTagName("KS_ID")[0].textContent;
            
            for (let j = 0; j < stops.length; j++) 
            {
                if(stops[j].stop_id === KS_ID)
                {
                    innerElement.push(`<a href=stop.html?stopid=${stops[j].stop_id}&label=${stops[j].label}">${stops[j].label}</a>` + "  " +
                                        + Math.ceil(result[i].getElementsByTagName("time")[0].textContent/60) + " минут(ы)" + "<br/>");
                    break;
                }
            }
        }
        if (innerElement.length === 0){
            innerElement = "<h3>Остановки отсутствуют</h3>";
            console.log("Остановки отсутствуют");
        }
        ListStops.innerHTML = innerElement;
    });
}

async function transportStop(stopID, ListTransport) 
{
    let URL = `https://tosamara.ru/api/v2/xml?method=getFirstArrivalToStop&KS_ID=${stopID}&os=android&clientid=test&authkey=${sha1(stopID+"just_f0r_tests")}`    
    let result = await fetch(URL)
    .then( response => response.text() ).then( str => 
    {
        let parser = new window.DOMParser();
        return parser.parseFromString(str, "text/xml") 
    });

    result = result.getElementsByTagName("transport");
    let innerElement = "";

    for (let i = 0; i < result.length; i++)
    {
        innerElement += `<a href="stopsroutetransport.html?hullNo=${result[i].getElementsByTagName("hullNo")[0].childNodes[0].nodeValue}&name=${result[i].getElementsByTagName("number")[0].childNodes[0].nodeValue + "  " + result[i].getElementsByTagName("type")[0].childNodes[0].nodeValue}">` + 
            result[i].getElementsByTagName("number")[0].childNodes[0].nodeValue + "  " + result[i].getElementsByTagName("type")[0].childNodes[0].nodeValue
            + `</a>` + ' ' + result[i].getElementsByTagName("time")[0].childNodes[0].nodeValue + " Минут" + "<br/>";
        console.log(innerElement);
    }
    if (innerElement.length === 0){
        innerElement = "<h3>Транспорт отсутствует</h3>";
        console.log("Транспорт отсутствует");
    }
    ListTransport.innerHTML = innerElement;
}

async function loadTransportStop(stopID) 
{
    let url = `https://tosamara.ru/api/v2/xml?method=getFirstArrivalToStop&KS_ID=${stopID}&os=android&clientid=test&authkey=${sha1(stopID+"just_f0r_tests")}`;
    
    try 
    {
        let result = await fetch(url).then(response => response.text()).then(str => 
        {
            let parser = new window.DOMParser();
            return parser.parseFromString(str, "text/xml")
        });
        return result;
    }
    catch (err) 
    { 
        console.log('err:', err); 
    }
}

function filterFunction() 
{
    var input, filter, a, i;

    loadDataInput(LOADED_STOPS, ListInputElement);

    input = document.getElementById("search_text");
    filter = input.value.toUpperCase();
    div = document.getElementById("input-list");
    a = div.getElementsByTagName("a");

    for (i = 0; i < a.length; i++) 
    {
        txtValue = a[i].textContent || a[i].innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) 
        {
            a[i].style.display = "";
        } 
        else 
        {
            a[i].style.display = "none";
        }
    }
}

function loadDataInput(data, element) 
{
    if(data) 
    {
        let innerElement = "";
        let stops_data = data.getElementsByTagName("stop");

        for(let i = 0; i < stops_data.length; i++)
        {
            try
            {
                innerElement += `<a href="stops.html?id=${stops_data[i].getElementsByTagName("KS_ID")[0].childNodes[0].nodeValue}">` +
                stops_data[i].getElementsByTagName("title")[0].childNodes[0].nodeValue +"<br/> "+ 
                stops_data[i].getElementsByTagName("direction")[0].childNodes[0].nodeValue
                + "<br/>" + "<hr/>"+  `</a>`;
            }
            catch(err)
            {
                innerElement += `<a href="stops.html?id=${stops_data[i].getElementsByTagName("KS_ID")[0].childNodes[0].nodeValue}">` +
                stops_data[i].getElementsByTagName("title")[0].childNodes[0].nodeValue +"<br/> "+ `</a>`;
            }
        }
        element.innerHTML = innerElement;
    }
}

async function searchstop()
{
    const data = await loadStops();

    let size = data.getElementsByTagName("stop").length;
    let stop_data = data.getElementsByTagName("stop");

    let lst = new Array();

    for (let i = 0; i < size; i++) 
    {
        lst.push(new Tag_map(stop_data[i].childNodes[0].textContent,
            stop_data[i].childNodes[1].textContent
            + stop_data[i].childNodes[2].textContent + 
            stop_data[i].childNodes[3].textContent,
            stop_data[i].childNodes[24].textContent,
            stop_data[i].childNodes[23].textContent));
    }

    input = document.getElementById("myInput").value;

    for (let i = 0; i < lst.length; i++) 
    {
        if(input == lst[i].label)
            window.location.href = `stop.html?stopid=${lst[i].stop_id}&label=${lst[i].label}`;
    }
    
}

function autocomplete(inp) 
{
    var cur;
    let stop = []

    getInformation().then((stops) => 
    {
        for (let i = 0; i < stops.length; i++) {
            stop.push(stops[i].label)
        }
    });
    inp.addEventListener("input", function(e) 
    {
        var a, b, i, val = this.value;
        closeAllLists();

        if (!val) 
          return false;

        cur = -1;

        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");

        this.parentNode.appendChild(a);
        
        for (i = 0; i < stop.length; i++) 
        {
          if (stop[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) 
          {
            b = document.createElement("DIV");
            b.innerHTML = "<strong>" + stop[i].substr(0, val.length) + "</strong>";
            b.innerHTML += stop[i].substr(val.length);
            b.innerHTML += "<input type='hidden' value='" + stop[i] + "'>";
                b.addEventListener("click", function(e) 
                {
                inp.value = this.getElementsByTagName("input")[0].value;
                closeAllLists();
                });
            a.appendChild(b);
          }
        }
    });
    inp.addEventListener("keydown", function(e) 
    {
        var x = document.getElementById(this.id + "autocomplete-list");

        if (x) 
            x = x.getElementsByTagName("div");

        if (e.keyCode == 40) 
        {
          cur++;
          addActive(x);
        } 
        else if (e.keyCode == 38) 
        { 
          cur--;
          addActive(x);
        } 
        else if (e.keyCode == 13) 
        {
          e.preventDefault();
          if (cur > -1) 
          {
            if (x) 
                x[cur].click();
          }
        }
    });
    function addActive(x) 
    {
      if (!x) 
        return false;
      
      removeActive(x);
      
      if (cur >= x.length) cur = 0;
      if (cur < 0) cur = (x.length - 1);

      x[cur].classList.add("autocomplete-active");
    }
    function removeActive(x) 
    {
      for (var i = 0; i < x.length; i++)
      {
        x[i].classList.remove("autocomplete-active");
      }
    }
    function closeAllLists(elmnt) 
    {
      var x = document.getElementsByClassName("autocomplete-items");
      for (var i = 0; i < x.length; i++) 
      {
        if (elmnt != x[i] && elmnt != inp) 
        {
            x[i].parentNode.removeChild(x[i]);
        }
      }
    }
    document.addEventListener("click", function (e)     
    {
        closeAllLists(e.target);
    });
}