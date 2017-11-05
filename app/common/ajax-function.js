var appUrl = window.location.origin;

var ajaxFunctions = {
  ready : function ready (fn) {
    if(typeof fn !== 'function'){
      return;
    }

    if(document.readyState === 'complete'){
      console.log("document has been loaded inside readyState");
      return fn();
    }
    document.addEventListener('DOMContentLoaded', fn, false);
  },

  ajaxRequest: function ajaxRequest(method, url, json_obj, callback){
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
        console.log("11111111111 ajax-function " +xmlhttp.response);
          callback(xmlhttp.response);
      }
   };

   xmlhttp.open(method, url, true);
   xmlhttp.setRequestHeader("Content-Type", "application/json");
   console.log("ajax function" + JSON.stringify(json_obj));
	 xmlhttp.send(JSON.stringify(json_obj));
  //  xmlhttp.send();
  }
}
