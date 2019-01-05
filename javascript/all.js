const apiKey="6MVMLK-EJ3FXU-BTVB3F-3TNQ",satURL="https://www.n2yo.com/rest/v1/satellite/";var x=document.getElementById("local"),sLat=document.getElementById("searchLat"),sLng=document.getElementById("searchLng"),sRad=document.getElementById("searchRad"),sButton=document.getElementById("searchAbove"),e=document.getElementById("searchtype"),loop=!1,loopstarted=!1;let SatList=[],markers=[];function Satelite(t,e,a="",n="",r="",o="",s=""){this.satid=t,this.satname=e,this.intDesignator=a,this.launchDate=n,this.satlat=r,this.satlng=o,this.satalt=s,this.changeName=function(t){this.satname=t},this.SatDesignation=function(){return this.satname+" ("+this.id+")"}}function setLocation(t="40.079",e="-75.160",a="0"){this.setLat=t,this.setLng=e,this.setAlt=a}function findSatTLE(t){let e="apiKey="+apiKey;return $.ajax({url:satURL+"tle/"+t,data:e,success:function(t){return Satelite(t.info.satid,t.info.satname)},dataType:"json"})}function findSatAbove(){$(".errorDisplay").css("display","none"),loop=!1,console.log("satLoop: "+typeof satLoop),"undefined"!=typeof satLoop&&clearInterval(satLoop);let t=e.options[e.selectedIndex].value,a="";if(testLatint=isNumber(sLat.value),testLngint=isNumber(sLng.value),testLat=isLatitude(parseFloat(sLat.value)),testLng=isLatitude(parseFloat(sLat.value)),0==testLatint&&(a+="Lat must be a number <br />"),0==testLngint&&(a+="Lng must be a number <br />"),0==testLat&&(a+="Lat must be a value between -90 &amp; 90 <br />"),0==testLng&&(a+="Lng must be a  value between -180 &amp; 180 <br />"),""==a){deleteMarkers(),map.setCenter({lat:parseFloat(sLat.value),lng:parseFloat(sLng.value)});let e="apiKey="+apiKey;$.ajax({url:satURL+"above/"+sLat.value+"/"+sLng.value+"/0/"+sRad.value+"/"+t+"/",data:e,success:function(t){$("#satCnt").text("Sat Count: "+t.info.satcount),SatList=[];let e="";for(var a in t.above)t.above.hasOwnProperty(a)&&(e=e+"<a class='markerClick' data-markerid='"+a+"' href='javascript:satDetail("+t.above[a].satid+","+a+");'>"+t.above[a].satname+"</a><br/>",SatList.push(new Satelite(t.above[a].satid,t.above[a].satname,t.above[a].intDesignator,t.above[a].launchDate,t.above[a].satlat,t.above[a].satlng,t.above[a].satalt)),setMarkers(t.above[a]));document.getElementById("dataAbovebox").innerHTML=e},dataType:"json"});return getmarkercnt(),SatList}$(".errorDisplay").css("display","inline-block"),$(".errormsg").html(a)}function trackSat(t){let e="apiKey="+apiKey;$.ajax({url:satURL+"positions/"+t+"/"+sLat.value+"/"+sLng.value+"/0/300/",data:e,success:function(t){animateSat(t)}})}function animateSat(t){let e=0,a=findObjectByKey(SatList,"satid",t.info.satid);animateSat.clearTimer=s,clearMarkers(),markers=[],setMarkers(a),$("#dataAbovebox, #satCnt").html(""),map.setCenter({lat:parseFloat(t.positions[e].satlatitude),lng:parseFloat(t.positions[e].satlongitude)}),$("#databox").html("Satellite: "+t.info.satname),0==loopstarted&&map.setZoom(6),loop=!0,loopstarted=!0;for(var n=setInterval(function(){1==loop&&(curLat=parseFloat(t.positions[e].satlatitude),curLng=parseFloat(t.positions[e].satlongitude),$("#searchLat").val(curLat),$("#searchLng").val(curLng),map.setCenter({lat:curLat,lng:curLng}),markers[0].setPosition({lat:curLat,lng:curLng}));0==loop&&1==loopstarted&&(s(),loopstarted=!1);300==++e&&(s(),trackSat(t.info.satid),e=0,loop=!1)},1e3),r=[],o=0;o<300;o++)r.push({lat:parseFloat(t.positions[o].satlatitude),lng:parseFloat(t.positions[o].satlongitude)}),console.log("c");function s(){clearInterval(n)}return new google.maps.Polyline({path:r,geodesic:!0,strokeColor:"#FF0000",strokeOpacity:1,strokeWeight:2}).setMap(map),n}function isNumber(t){return!isNaN(parseFloat(t))&&isFinite(t)}function isLatitude(t){return isFinite(t)&&Math.abs(t)<=90}function isLongitude(t){return isFinite(t)&&Math.abs(t)<=180}function getmarkercnt(){console.log("getmarkercnt: "+markers.length)}function changeMarker(t){$("#map").attr("data-markers",results.length)}function satDetail(t,e){var a=findObjectByKey(SatList,"satid",t);map.setCenter({lat:parseFloat(a.satlat),lng:parseFloat(a.satlng)}),$("#databox").text("Satellite: "+a.satname)}function findObjectByKey(t,e,a){for(var n=0;n<t.length;n++)if(t[n][e]===a)return t[n];return null}function addSatInfo(t){for(var e=0;e<SatDataExt.length;e++)if(SatDataExt[e]["COSPAR Number"]===t)return showAddDetail(SatDataExt[e]),SatDataExt[e]}function showAddDetail(t){let e="";e="<h2>"+t["Current Official Name of Satellite"]+"</h2>UN Registry: "+t["Country/Org of UN Registry"]+"<br />Country: "+t["Country of Operator/Owner"]+"<br />Operator/Owner: "+t["Operator/Owner"]+"<br />Users: "+t.Users+"<br />Purpose: "+t.Purpose+"<br />Detailed Purpose: "+t["Detailed Purpose"]+"<br />Class of Orbit: "+t["Class of Orbit"]+"<br />Type of Orbit: "+t["Type of Orbit"]+"<br />Longitude of GEO: "+t["Longitude of GEO (degrees)"]+"&deg;<br />Perigee: "+t["Perigee (km)"]+" km<br />Apogee: "+t["Apogee (km)"]+" km<br />Eccentricity: "+t.Eccentricity+"<br />Inclination: "+t["Inclination (degrees)"]+"&deg;<br />Period: "+t["Period (minutes)"]+" minutes<br />Launch Mass: "+t["Launch Mass (kg.)"]+"kg<br />Dry Mass: "+t["Dry Mass (kg.)"]+"kg<br />Power: "+t["Power (watts)"]+"w<br />Date of Launch: "+t["Date of Launch"]+"<br />Expected Lifetime: "+t["Expected Lifetime"]+"<br />Contractor: "+t.Contractor+"<br />Country of Contractor:"+t["Country of Contractor"]+"<br />Launch Site: "+t["Launch Site"]+"<br />Launch Vehicle: "+t["Launch Vehicle"]+"<br />COSPAR Number: "+t["COSPAR Number"]+"<br />NORAD Number: "+t["NORAD Number"]+"<br />Comments: "+t.Comments+"<br />",$("#addInfo").html(e),$("#addInfo").css("display","none"),$(this).simplePopup({type:"html",htmlSelector:"#addInfo"})}function getLocation(){navigator.geolocation?navigator.geolocation.getCurrentPosition(showPosition,showError):x.innerHTML="Geolocation is not supported by this browser."}function showError(t){switch(t.code){case t.PERMISSION_DENIED:x.innerHTML="User denied the request for Geolocation.",findSatAbove();break;case t.POSITION_UNAVAILABLE:x.innerHTML="Location information is unavailable.";break;case t.TIMEOUT:x.innerHTML="The request to get user location timed out.";break;case t.UNKNOWN_ERROR:x.innerHTML="An unknown error occurred."}}function showPosition(t){return currentLat=t.coords.latitude,currentLng=t.coords.longitude,currentAlt=t.coords.altitude,null!=currentAlt&&(currentAlt=currentAlt.toFixed(6)),console.log(currentLat,currentLng,currentAlt),x.innerHTML="Your current coordinates: <br />Lat: "+currentLat.toFixed(6)+"<br/>Lng: "+currentLng.toFixed(6)+"<br/>Alt: "+currentAlt,sLat.value=t.coords.latitude,sLng.value=t.coords.longitude,initMap(currentLat,currentLng),sButton.disabled=!1,loop=!1,findSatAbove(),setLocation(currentLat,currentLng,currentAlt)}var map;function initMap(t,e){(map=new google.maps.Map(document.getElementById("map"),{center:{lat:parseFloat(t),lng:parseFloat(e)},zoom:5})).addListener("dragend",function(){newCenter=map.getCenter(),$("#searchLat").val(newCenter.lat()),$("#searchLng").val(newCenter.lng()),findSatAbove()})}function setMarkers(t){var e=new google.maps.Marker({record_id:t.satid,position:{lat:parseFloat(t.satlat),lng:parseFloat(t.satlng)},map:map,icon:"./img/icons8-satellite-50.png",title:t.satname});infocontent="<b>"+t.satname+"</b><br/>Satid: "+t.satid+"<br/>Intl Des: "+t.intDesignator+"<br/>Launched: "+formatDate(t.launchDate)+"<br/>Lat: "+t.satlat+"<br/>Lng: "+t.satlng+"<br/>Alt: "+t.satalt+"km",1==checkaddInfo(t.intDesignator)&&(infocontent=infocontent+"<br/><a href='javascript:addSatInfo(\""+t.intDesignator+"\")'>Additonal info</a> "),infocontent=infocontent+"<br/><a href='javascript:trackSat(\""+t.satid+"\")'>Track me</a> ";var a=new google.maps.InfoWindow({content:infocontent});google.maps.event.addListener(e,"click",function(){a&&a.close(),a.open(map,e)}),markers.push(e)}function checkaddInfo(t){for(var e=0;e<SatDataExt.length;e++)if(SatDataExt[e]["COSPAR Number"]===t)return!0}function setMapOnAll(t){for(var e=0;e<markers.length;e++)markers[e].setMap(t)}function clearMarkers(){setMapOnAll(null)}function showMarkers(){setMapOnAll(map)}function deleteMarkers(){clearMarkers(),markers=[]}function formatDate(t){var e=t.substr(0,4);return t.substr(5,2)+"/"+t.substr(8,2)+"/"+e}console.log("UCS: "+SatDataExt[1].Users),console.log("UCS: "+SatDataExt[1]["Country/Org of UN Registry"]),console.log("UCS: "+SatDataExt[1]["NORAD Number"]);