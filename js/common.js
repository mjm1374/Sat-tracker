const apiKey = "6MVMLK-EJ3FXU-BTVB3F-3TNQ";
const GMAP = "AIzaSyDpn5_1gAS4SJOuzvkeMZK22yOlvZY2kKE";
const satURL = "https://www.n2yo.com/rest/v1/satellite/"
    
    // Constructor function for Satelite objects
    //function Satelite( id, satname,intDesignator,launchDate,satlat,satlng, satalt) {
    //    this.id = id;
    //    this.satname = satname;
    //    this.intDesignator = intDesignator;
    //    this.launchDate = launchDate;
    //    this.satlat = satlat;
    //    this.satlng = satlng;
    //    this.satalt = satalt;
    //    
    //    this.changeName = function (name) {
    //        this.satname = name;
    //    }; 
    //    this.SatDesignation = function () {
    //      return this.satname + " (" + this.id + ")";
    //      
    //    };
    // 
    //}
        function Satelite( id, satname) {
        this.id = id;
        this.satname = satname;
      
        
        this.changeName = function (name) {
            this.satname = name;
        }; 
        this.SatDesignation = function () {
          return this.satname + " (" + this.id + ")";
          
        };
     
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
    
 