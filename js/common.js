/* Satelite search scripts by Mike McAllister
 * mike@logikbox.com
 * 5/31/2018
 *
 * based of the N2YO API
 * https://www.n2yo.com/api/#above
 */

const apiKey = "6MVMLK-EJ3FXU-BTVB3F-3TNQ";
const GMAP = "AIzaSyDpn5_1gAS4SJOuzvkeMZK22yOlvZY2kKE";
const satURL = "https://www.n2yo.com/rest/v1/satellite/"


    var x = document.getElementById("local");
    var sLat = document.getElementById("searchLat");
    var sLng = document.getElementById("searchLng");
    var sRad = document.getElementById("searchRad");
    var sButton = document.getElementById("searchAbove");
    
     //Constructor function for Satelite objects
    function Satelite( id, satname,intDesignator = "",launchDate = "" ,satlat = "",satlng = "", satalt = "") {
        this.id = id;
        this.satname = satname;
        this.intDesignator = intDesignator;
        this.launchDate = launchDate;
        this.satlat = satlat;
        this.satlng = satlng;
        this.satalt = satalt;
        
        this.changeName = function (name) {
            this.satname = name;
        }; 
        this.SatDesignation = function () {
          return this.satname + " (" + this.id + ")";
          
        };
     
    }
    
    /*Constructor function for current location
     *
     * Defaults to Philly, cause Philly rules!
     */
    
    function setLocation (lat = '40.079', lng=  '-75.160', alt = '0'){
        this.setLat =  lat;
        this.setLng = lng;
        this.setAlt = alt;
    }
 
    
  
    

    /* Different Satelite searchs 
     *
     *  findSatTLE - Find a specific satelite by Norad ID (satid)
     *  findSatAbove -  Finds all satelite above a location by radius
     *
     *
     *  
     */
    
    
    function findSatTLE(id) {
    // Request: tle/{id}
    
      let data = "apiKey=" +  apiKey; 
        
      let theJson =  $.ajax({
            url: satURL + "tle/" + id ,
            data: data,
            success: function (data) {
                console.log(data);
                console.log(data.info.satname);
                return (Satelite(data.info.satid,data.info.satname));
              },
            dataType: 'json'
          });
            
            
        return theJson;
        
    }
    
    
    function findSatAbove(){
        console.log(sLat.value);
        
        // Category     ID
		//Amateur radio	18
		//Beidou Navigation System	35
		//Brightest	1
		//Celestis	45
		//CubeSats	32
		//Disaster monitoring	8
		//Earth resources	6
		//Education	29
		//Engineering	28
		//Experimental	19
		//Flock	48
		//Galileo	22
		//Geodetic	27
		//Geostationary	10
		//Global Positioning System (GPS)	20
		//Globalstar	17
		//Glonass Operational	21
		//GOES	5
		//Gonets	40
		//Gorizont	12
		//Intelsat	11
		//Iridium	15
		//IRNSS	46
		//ISS	2
		//Lemur	49
		//Military	30
		//Molniya	14
		//Navy Navigation Satellite System	24
		//NOAA	4
		//O3B Networks	43
		//Orbcomm	16
		//Parus	38
		//QZSS	47
		//Radar Calibration	31
		//Raduga	13
		//Russian LEO Navigation	25
		//Satellite-Based Augmentation System	23
		//Search & rescue	7
		//Space & Earth Science	26
		//Strela	39
		//Tracking and Data Relay Satellite System	9
		//Tselina	44
		//Tsikada	42
		//Tsiklon	41
		//TV	34
		//Weather	3
		//Westford Needles	37
		//XM and Sirius	33
		//Yaogan	36
        
        // Request: /above/{observer_lat}/{observer_lng}/{observer_alt}/{search_radius}/{category_id}
        
        let data = "apiKey=" +  apiKey; 
        
        let theJson =  $.ajax({
            url: satURL + "above/" + id + "/" + sLat.value + "/" + sLng.value + "/0/" + sRad.value + "/18",
            data: data,
            success: function (data) {
                console.log("findSatAbove: " + data);
                //console.log(data.info.satname);
                //return (Satelite(data.info.satid,data.info.satname));
              },
            dataType: 'json'
          });
            
            
        return theJson;
        
        
        
    }
    
    
    /* Set up for localization
     *
     * getLocation - uses browser build in position module
     * showPosition -  sets the position object and populates the forms with default location
     *
     * TODO: Better error catching on browser location (getlocation)
     *
     */


    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);  
        } else { 
            x.innerHTML = "Geolocation is not supported by this browser.";
        }
    }
    
    function showPosition(position) {
        currentLat = position.coords.latitude;
        currentLng = position.coords.longitude;
        currentAlt = position.coords.altitude;
        console.log(currentLat, currentLng, currentAlt);
        x.innerHTML =  "Lat: " + currentLat + "<br/>Lng: " + currentLng + "<br/>Alt: " + currentAlt;
        
        sLat.value = position.coords.latitude;
        sLng.value = position.coords.longitude;
        sButton.disabled = false;
        
        return setLocation(currentLat,currentLng,currentAlt);
        
    }
        