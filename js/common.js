const apiKey = "6MVMLK-EJ3FXU-BTVB3F-3TNQ";
const GMAP = "AIzaSyDpn5_1gAS4SJOuzvkeMZK22yOlvZY2kKE";
const satURL = "https://www.n2yo.com/rest/v1/satellite/"
    
    // Constructor function for Satelite objects
    function Satelite( id, satname,intDesignator,satlat,satlng, satalt) {
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
    
  findSatelinte(25544 );
    
    function findSatelinte(id) {
        ///Request: tle/{id}
      let data = "apiKey=" +  apiKey; 
        
        $.ajax({
            url: satURL + "tle/" + id ,
            data: data,
            success: function (data) {
                console.log(data);
              },
            dataType: 'json'
          });
        
        
    }
    
 