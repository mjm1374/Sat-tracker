/* Satelite search scripts by Mike McAllister
 * mike@logikbox.com
 * 5/31/2018
 *
 * based of the N2YO API
 * https://www.n2yo.com/api/#above
 */

const apiKey = "6MVMLK-EJ3FXU-BTVB3F-3TNQ";
const GMAP = "AIzaSyDpn5_1gAS4SJOuzvkeMZK22yOlvZY2kKE";
const satURL = "https://www.n2yo.com/rest/v1/satellite/";


    var x = document.getElementById("local");
    var sLat = document.getElementById("searchLat");
    var sLng = document.getElementById("searchLng");
    var sRad = document.getElementById("searchRad");
    var sButton = document.getElementById("searchAbove");
    var e = document.getElementById("searchtype");
    //var sType = e.options[e.selectedIndex].value;
    let SatList = [];
    let markers = [];
    
     //Constructor function for Satelite objects
    function Satelite( id, satname,intDesignator = "",launchDate = "" ,satlat = "",satlng = "", satalt = "") {
        this.satid = id;
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
    
    function isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
      }
      
    function isLatitude(lat) {
        return isFinite(lat) && Math.abs(lat) <= 90;
      }
      
      function isLongitude(lng) {
        return isFinite(lng) && Math.abs(lng) <= 180;
      }
    /* TODO: catch errors o blank inputs and bad json
     *
     */
     
    function findSatAbove(){        
        // Request: /above/{observer_lat}/{observer_lng}/{observer_alt}/{search_radius}/{category_id}
        //sType = document.getElementById("searchtype").value;
        $(".errorDisplay").css("display","none");
       
        let sType = e.options[e.selectedIndex].value;
        let errmsg = ""; 

        //Check for errors
        testLatint  = isNumber(sLat.value);
        testLngint  = isNumber(sLng.value);
        testLat  = isLatitude(parseFloat(sLat.value));
        testLng  = isLatitude(parseFloat(sLat.value));
        
        //console.log(isLatitude(parseFloat(sLat.value)));
        
        if(testLatint == false ) {errmsg = errmsg + "Lat must be a number <br />";}
        if(testLngint == false ) {errmsg = errmsg + "Lng must be a number <br />";}
        if(testLat == false ) {errmsg = errmsg + "Lat must be a value between -90 &amp; 90 <br />";}
        if(testLng == false ) {errmsg = errmsg + "Lng must be a  value between -180 &amp; 180 <br />";}
        
        //console.log("errmsg: " + errmsg  + sLng.value + "/" + testLat);
        
        if (errmsg != ""){
            //lets send the erro messages
            $(".errorDisplay").css("display","inline-block");
            $(".errormsg").html(errmsg);
            
            
        }
        else
        {
            
        //Lets get some data
        
            map.setCenter({lat:parseFloat(sLat.value), lng:parseFloat(sLng.value) });
            let data = "apiKey=" +  apiKey; 
            
            let theJson =  $.ajax({
                url: satURL + "above/" + sLat.value + "/" + sLng.value + "/0/" + sRad.value + "/" + sType + "/",
                data: data,
                success: function (data) {
                    
                     //var obj = JSON.parse(data);
                    
                    $("#satCnt").text("Sat Count: " + data.info.satcount);
                    //call the map  
                    //initMap(sLat.value ,sLng.value );
                    
                    SatList = [];
                    //var infowindow = new google.maps.InfoWindow();
                    //var marker  = [];
                    //var markers = [];
                    let writer = ""; //creates the temp interface
                    for (var key in data.above)
                    {
                       if (data.above.hasOwnProperty(key))
                       {
                          // here you have access to
                            writer = writer +  "<a class='markerClick' data-markerid='" + key + "' href='javascript:satDetail(" + data.above[key].satid +  "," + key + ");'>" + data.above[key].satname + "</a><br/>";
                            SatList.push(new Satelite(
                                                  data.above[key].satid,
                                                  data.above[key].satname,
                                                  data.above[key].intDesignator,
                                                  data.above[key].launchDate,
                                                  data.above[key].satlat,
                                                  data.above[key].satlng,
                                                  data.above[key].satalt
                                                  ));
                             
                           
                              //$('.markerClick').on('click', function () {
                              //
                              //      google.maps.event.trigger(markers[$(this).data('markerid')], 'click');
                              //  });
                                console.log(data.above[key]);             
                                setMarkers(data.above[key]);
                        
                       }
                    }
                    
                    //Loop throught he object and create interface
                    
                     
                    //var arrayLength = SatList.length;
                    //for (var i = 0; i < arrayLength; i++) {
                    //    //console.log(SatList[i].satname);
                    //    //Do something
                    //}
                                    
                    document.getElementById("dataAbovebox").innerHTML = writer;
                    //return (SatList);
                  },
                dataType: 'json'
              });
             
           
             return (SatList);
             
            
         }
        

    }
    
    function setMarkers(thisSat){
            
                console.log("v: "  + thisSat.satid); 
                var marker = new google.maps.Marker({
                record_id: thisSat.satid,
                position: {lat: parseFloat(thisSat.satlat), lng: parseFloat(thisSat.satlng)},
                map: map,
                icon: './img/icons8-satellite-50.png',
                title: thisSat.satname
                
            });
               
               infocontent = "<b>" + thisSat.satname + "</b>" +
                "<br/>Intl Des: " + thisSat.intDesignator +
                "<br/>Launched: " + formatDate(thisSat.launchDate) +
                "<br/>Lat: " + thisSat.satlat +
                "<br/>Lng: " + thisSat.satlng +
                "<br/>Alt: " + thisSat.satalt + "km"
                ;
            
            var infowindow = new google.maps.InfoWindow({
                content: infocontent
              });
            
            marker.addListener('click', function() {
                infowindow.open(map, marker);
              });

            console.log("setMarkers: " + thisSat.satid);
            //markers.push(marker);


    }
    
    
    function changeMarker(record_id){
        var markers = $('#map').attr("data-markers",results.length);
        
      
        //for (i in map.marker){
        //    if(map.marker[i].record_id == record_id){
        //        console.log(map.marker[i].record_id );
        //        map.marker[i].setIcon('http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=title|EC2A8C|000000');
        //        google.maps.event.trigger(map.marker[i], 'click');
        //    }
        //}
    }
    
    /* Get the Satelite detail on click
     *  
     * TODO: Open the marker when selected
     */
    function satDetail(searchsatid, key){
        //console.log("marker length: " + markers.length);
        var resultObject = findObjectByKey(SatList,'satid',searchsatid);
        //console.log(resultObject);
        map.setCenter({lat: parseFloat(resultObject.satlat), lng: parseFloat(resultObject.satlng)});
        
        $('#databox').text('Satellite: ' + resultObject.satname);
    }

    // look through and array of object and do match on obj value
    function findObjectByKey(array, key, value) {
        for (var i = 0; i < array.length; i++) {
            //console.log(array[i][key]);
            if (array[i][key] === value) {
                return array[i];
            }
        }
        return null;
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
        x.innerHTML =  "Your current coordinates: <br />Lat: " + currentLat + "<br/>Lng: " + currentLng + "<br/>Alt: " + currentAlt;
        
        sLat.value = position.coords.latitude;
        sLng.value = position.coords.longitude;
        initMap(currentLat ,currentLng ); // init gmap
        sButton.disabled = false;
        
        findSatAbove();
        
        
        return setLocation(currentLat,currentLng,currentAlt);
        
    }
    
    
    
    /* GMAP
     *
     *
     *
     *
     *
     */
    
    
    var map;
      function initMap(newLat, newLng) {
        console.log('map ' + newLat + "/" + newLng);
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: parseFloat(newLat), lng: parseFloat(newLng)},
          zoom: 5
        });
        //map.addListener('dragend', function() {
        //    
        //    newCenter =  map.getCenter();
        //    $("#searchLat").val(newCenter.lat());
        //    $("#searchLng").val(newCenter.lng());
        //    console.log("xxx: " + newCenter.lat());
        //    findSatAbove();
        //
        //
        // });
      }
      
      
      
      function formatDate(thisDate){
        var year = thisDate.substr(0, 4);
        var mon = thisDate.substr(5, 2);
        var day = thisDate.substr(8, 2);
        let newDate = mon + "/" + day + "/" + year;
        return newDate;
        
        
      }