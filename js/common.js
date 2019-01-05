/* Satelite search scripts by Mike McAllister
 * mike@logikbox.com
 * 5/31/2018
 *
 * based of the N2YO API
 * https://www.n2yo.com/api/#above
 *
 * Addiotnal Data from UCS
 * https://www.ucsusa.org/nuclear-weapons/space-weapons/satellite-database
 *
 */

const apiKey = "6MVMLK-EJ3FXU-BTVB3F-3TNQ";
//const GMAP = "AIzaSyDpn5_1gAS4SJOuzvkeMZK22yOlvZY2kKE";
const satURL = "https://www.n2yo.com/rest/v1/satellite/";


    var x = document.getElementById("local");
    var sLat = document.getElementById("searchLat");
    var sLng = document.getElementById("searchLng");
    var sRad = document.getElementById("searchRad");
    var sButton = document.getElementById("searchAbove");
    var e = document.getElementById("searchtype");
    
    //the loop vars are for cleaning out teh setInterval in AnimSat function.
    //The double trigger is used to determine if a loop is running and if the loop was just started or ended.
    var loop = false;
    var loopstarted = false;
    
    //var sType = e.options[e.selectedIndex].value;
    let SatList = [];
    let markers = [];
    
    console.log("UCS: " + SatDataExt[1].Users);
    console.log("UCS: " + SatDataExt[1][ 'Country/Org of UN Registry' ]);
    console.log("UCS: " + SatDataExt[1][ 'NORAD Number' ]);
    
    //addSatInfo('41556');
   // trackSat('41556');
    
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
                //console.log(data);
                //console.log(data.info.satname);
                return (Satelite(data.info.satid,data.info.satname));
              },
            dataType: 'json'
          });
            
            
        return theJson;
        
    }

      
      
      
    /* Find All Sats in view
     * TODO: catch errors on json
     *
     */
     
    function findSatAbove(){        
        // Request: /above/{observer_lat}/{observer_lng}/{observer_alt}/{search_radius}/{category_id}
        //sType = document.getElementById("searchtype").value;
        $(".errorDisplay").css("display","none");
        loop = false;
         console.log("satLoop: " + typeof satLoop);
         
         
        if(typeof satLoop !== 'undefined'){
           
           clearInterval(satLoop);
        }
         
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
            deleteMarkers();
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
                                //console.log(data.above[key]);             
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
             
            getmarkercnt();
             return (SatList);
             
            
         }
        

    }
    
    /* Track a Sateltie for x sec
     *
     *
     */
    
    function trackSat(satid){
        //Request: /positions/{id}/{observer_lat}/{observer_lng}/{observer_alt}/{seconds}
        let data = "apiKey=" +  apiKey; 
            
        let theJson =  $.ajax({
                url: satURL + "positions/"+ satid + "/" + sLat.value + "/" + sLng.value + "/0/300/",
                data: data,
                success: function (data) {
                    //do something
                    //console.log(data.positions);
                    animateSat(data);
                }
        });
        
        
    }
    
    function animateSat(satPos){
        let i = 0;
        
        let thisSat = findObjectByKey(SatList,'satid',satPos.info.satid);
        
        animateSat.clearTimer = clearTimer;
        
        clearMarkers();
        markers = [];
        setMarkers(thisSat);
        $("#dataAbovebox, #satCnt").html("");
        map.setCenter({lat: parseFloat(satPos.positions[i].satlatitude), lng: parseFloat(satPos.positions[i].satlongitude)});
        $("#databox").html("Satellite: " + satPos.info.satname + "");
        if (loopstarted == false){
            map.setZoom(6);
        }
        //console.log(satPos.info.satid);
        
        loop =  true;
        loopstarted = true;
        
        var satLoop = setInterval(myTimer, 1000);
        
        var flightPlanCoordinates = [];
        
        for (var j = 0; j < 300; j++) 
            {
                flightPlanCoordinates.push({lat: parseFloat(satPos.positions[j].satlatitude) , lng: parseFloat(satPos.positions[j].satlongitude) });
                console.log("c");
            }
                    
        
        var flightPath = new google.maps.Polyline({
          path: flightPlanCoordinates,
          geodesic: true,
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 2
        });

        flightPath.setMap(map);

            function myTimer() {
                //console.log(satPos.positions[i].satlatitude + "/" + satPos.positions[i].satlongitude );
                if (loop == true){
                        curLat = parseFloat(satPos.positions[i].satlatitude);
                        curLng = parseFloat(satPos.positions[i].satlongitude);
                        
                        $('#searchLat').val(curLat);
                        $('#searchLng').val(curLng);
                        map.setCenter({lat: curLat, lng: curLng});
                        markers[0].setPosition({lat: curLat, lng: curLng});
                    }
                    
                 if (loop == false && loopstarted == true){
                      clearTimer();
                      loopstarted = false;
                    }
                    
                i++;
                if (i == 300){
                    clearTimer();
                    trackSat(satPos.info.satid);
                    i = 0;
                    loop = false;
                }
            }
            
            function clearTimer(){
                
                clearInterval(satLoop);
            }
            
            
        
        return satLoop;
        
    }


    
    /* ERROR CHECKING
     *
     *
     */
    function isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
      }
      
    function isLatitude(lat) {
        return isFinite(lat) && Math.abs(lat) <= 90;
      }
      
      function isLongitude(lng) {
        return isFinite(lng) && Math.abs(lng) <= 180;
      }
      
      function getmarkercnt(){
        console.log("getmarkercnt: " + markers.length);
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
    
       function addSatInfo(satid){
       // console.log("UCS: " + SatDataExt[1][ 'Country/Org of UN Registry' ]);
       //console.log("addInfo: " +  satid);
       for (var i = 0; i < SatDataExt.length; i++) {
        
           //console.log("UCSR: " + SatDataExt[i][ 'COSPAR' ] + " = " + satid);
            if(SatDataExt[i][ 'COSPAR Number' ] === satid) {
                
                 //console.log("addInfoResp: " +  i);
                 showAddDetail(SatDataExt[i]);
                 return SatDataExt[i];
            }
        }
    }
    
    function showAddDetail(addDetail){
        
        let addWriter = "";
        addWriter = 
        "<h2>" +         addDetail["Current Official Name of Satellite"] + "</h2>" +
		"UN Registry: " +           addDetail["Country/Org of UN Registry"] + "<br />" +
		"Country: " +               addDetail["Country of Operator/Owner"] + "<br />"  +
		"Operator/Owner: " +        addDetail["Operator/Owner"] + "<br />" +
		"Users: " +                 addDetail["Users"] + "<br />" +
		"Purpose: " +               addDetail["Purpose"] + "<br />" +
		"Detailed Purpose: " +      addDetail["Detailed Purpose"] + "<br />" +
		"Class of Orbit: " +        addDetail["Class of Orbit"] + "<br />" +
		"Type of Orbit: " +         addDetail["Type of Orbit"] + "<br />" +
		"Longitude of GEO: " +      addDetail["Longitude of GEO (degrees)"] + "&deg;<br />" +
		"Perigee: " +               addDetail["Perigee (km)"] + " km<br />" +
		"Apogee: "  +               addDetail["Apogee (km)"] + " km<br />" +
		"Eccentricity: " +          addDetail["Eccentricity"] + "<br />" +
		"Inclination: " +           addDetail["Inclination (degrees)"] + "&deg;<br />" +
		"Period: " +                addDetail["Period (minutes)"] + " minutes<br />" +
		"Launch Mass: " +           addDetail["Launch Mass (kg.)"] + "kg<br />" +
		"Dry Mass: " +              addDetail["Dry Mass (kg.)"] + "kg<br />" +
		"Power: " +                 addDetail["Power (watts)"] + "w<br />" +
		"Date of Launch: " +        addDetail["Date of Launch"] + "<br />" +
		"Expected Lifetime: " +     addDetail["Expected Lifetime"] + "<br />" +
		"Contractor: " +            addDetail["Contractor"] + "<br />" +
		"Country of Contractor:" +  addDetail["Country of Contractor"] + "<br />" +
		"Launch Site: " +           addDetail["Launch Site"] + "<br />" +
		"Launch Vehicle: " +        addDetail["Launch Vehicle"] + "<br />" +
		"COSPAR Number: " +         addDetail["COSPAR Number"] + "<br />" +
		"NORAD Number: " +          addDetail["NORAD Number"] + "<br />" +
		"Comments: " +              addDetail["Comments"] + "<br />"
        ;
        
        //alert(addWriter);
        $('#addInfo').html(addWriter);
         $('#addInfo').css("display","none");
        $(this).simplePopup({ type: "html", htmlSelector: "#addInfo" });
        
        
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
         
            navigator.geolocation.getCurrentPosition(showPosition,showError);  
        } else { 
            x.innerHTML = "Geolocation is not supported by this browser.";
            //console.log("in getloc");
            //defaultLocal = setLocation();
            //console.log(defaultLocal.setLat);
        }
    }
    
    function showError(error) {
        switch(error.code) {
          case error.PERMISSION_DENIED:
            x.innerHTML = "User denied the request for Geolocation.";
             findSatAbove();
            break;
          case error.POSITION_UNAVAILABLE:
            x.innerHTML = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            x.innerHTML = "The request to get user location timed out.";
            break;
          case error.UNKNOWN_ERROR:
            x.innerHTML = "An unknown error occurred.";
            break;
        }
      }
          
    function showPosition(position) {
        currentLat = position.coords.latitude;
        currentLng = position.coords.longitude;
        currentAlt = position.coords.altitude;
        if(currentAlt != null){currentAlt = currentAlt.toFixed(6);}
        console.log(currentLat, currentLng, currentAlt);
        x.innerHTML =  "Your current coordinates: <br />Lat: " + currentLat.toFixed(6) + "<br/>Lng: " + currentLng.toFixed(6) + "<br/>Alt: " + currentAlt;
        
        sLat.value = position.coords.latitude;
        sLng.value = position.coords.longitude;
        initMap(currentLat ,currentLng ); // init gmap
        sButton.disabled = false;
        loop = false;
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
        //console.log('map ' + newLat + "/" + newLng);
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: parseFloat(newLat), lng: parseFloat(newLng)},
          zoom: 5
        });
        map.addListener('dragend', function() {
        //    
           newCenter =  map.getCenter();
            $("#searchLat").val(newCenter.lat());
            $("#searchLng").val(newCenter.lng());
        //    console.log("xxx: " + newCenter.lat());
           findSatAbove();
        //
        //
        });
      }
      
    function setMarkers(thisSat){
      
          //console.log("v: "  + thisSat.satid); 
          var marker = new google.maps.Marker({
          record_id: thisSat.satid,
          position: {lat: parseFloat(thisSat.satlat), lng: parseFloat(thisSat.satlng)},
          map: map,
          icon: './img/icons8-satellite-50.png',
          title: thisSat.satname
          
      });
         
         infocontent = "<b>" + thisSat.satname + "</b>" +
         "<br/>Satid: " + thisSat.satid +
          "<br/>Intl Des: " + thisSat.intDesignator +
          "<br/>Launched: " + formatDate(thisSat.launchDate) +
          "<br/>Lat: " + thisSat.satlat +
          "<br/>Lng: " + thisSat.satlng +
          "<br/>Alt: " + thisSat.satalt + "km";
          
          if(checkaddInfo(thisSat.intDesignator ) == true){
            
            infocontent =  infocontent + "<br/><a href='javascript:addSatInfo(\x22" + thisSat.intDesignator + "\x22)'>Additonal info</a> " ;
          }
          
          infocontent =  infocontent + "<br/><a href='javascript:trackSat(\x22" + thisSat.satid + "\x22)'>Track me</a> " ;
          
          
         
      
      var infowindow = new google.maps.InfoWindow({
          content: infocontent
        });
      
      google.maps.event.addListener(marker,'click', function() {
         if (infowindow) { infowindow.close();}
          infowindow.open(map, marker);
        });

      //console.log("setMarkers: " + thisSat.satid);
      markers.push(marker);


    }
    
    function checkaddInfo(satid){

       for (var i = 0; i < SatDataExt.length; i++) {
        
           //console.log("UCSR: " + SatDataExt[i][ 'COSPAR' ] + " = " + satid);
            if(SatDataExt[i][ 'COSPAR Number' ] === satid) {
             
                 return true;
            }
        }
    }
    
    
    // Sets the map on all markers in the array.
      function setMapOnAll(map) {
        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(map);
        }
      }

      // Removes the markers from the map, but keeps them in the array.
      function clearMarkers() {
        setMapOnAll(null);
      }

      // Shows any markers currently in the array.
      function showMarkers() {
        setMapOnAll(map);
      }

      // Deletes all markers in the array by removing references to them.
      function deleteMarkers() {
        clearMarkers();
        markers = [];
      }     
      
      
      
      function formatDate(thisDate){
        var year = thisDate.substr(0, 4);
        var mon = thisDate.substr(5, 2);
        var day = thisDate.substr(8, 2);
        let newDate = mon + "/" + day + "/" + year;
        return newDate;
        
        
      }