const apiKey = "6MVMLK-EJ3FXU-BTVB3F-3TNQ";
const GMAP = "AIzaSyDpn5_1gAS4SJOuzvkeMZK22yOlvZY2kKE";
const satURL = "https://www.n2yo.com/rest/v1/satellite/"
    
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
    
    function setLocation (lat = '40.079', lng=  '-75.160', alt = '0'){
        this.setLat =  lat;
        this.setLng = lng;
        this.setAlt = alt;
    }
 
    
  
    
    function findSatTLE(id) {
    ///Request: tle/{id}
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
    
    var x = document.getElementById("local");

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
        return setLocation(currentLat,currentLng,currentAlt);
    }
        