module app.productList {
  interface IProductListModel {
    title: string;
    showImage: boolean;
    products: app.domain.IProduct[];
    toggleImage(): void;
  }

  class ProductListCtrl implements IProductListModel {
    title: string;
    showImage: boolean;
    products: app.domain.IProduct[];

    static $inject = ["dataAccessService"];
    constructor(private dataAccessService: app.common.DataAccessService) {
      this.title = "Product List";
      this.showImage = false;
      this.products = [];

      var productResource = dataAccessService.getProductResource();
      productResource.query((data: app.domain.IProduct[]) => {
        this.products = data;
      });
      
      /***
       * Testing CSOM code
       */
      $(document).ready(function() {
       //loadRequiredSharePointLibraries();
      })
    }

    toggleImage(): void {
      this.showImage = !this.showImage;
    }

  }

  var hostweburl: string;
  var appweburl: string;

  function getQueryStringParameter(param: string) {
    
    console.log("document URL", document.URL);
    var params = document.URL.split("?")[1].split("&");
    var strParams = "";
    for (var i = 0; i < params.length; i = i + 1) {
      var singleParam = params[i].split("=");
      if (singleParam[0] == param) {
        return singleParam[1];
      }
    }
  }

  function loadRequiredSharePointLibraries() {
    // Load the required SharePoint libraries
    $(document).ready(function() {
      //Get the URI decoded URLs.
      //hostweburl = "https://rushenterprises.sharepoint.com/sites/dev";
      hostweburl = decodeURIComponent(
            getQueryStringParameter('SPHostUrl'));
      //addinweburl = "https://rushenterprises-843e46c9474926.sharepoint.com/sites/dev/Sharepoint-JsAppSandbox";
      //addinweburl = "https://localhost:8080";
      appweburl =  decodeURIComponent(
           getQueryStringParameter('SPAppWebUrl'));
      
      // resources are in URLs in the form:
      // web_url/_layouts/15/resource
      var scriptbase = hostweburl + "/_layouts/15/";

      // Load the js files and continue to the successHandler
      $.getScript(scriptbase + "SP.Runtime.js",
        function() {
          $.getScript(scriptbase + "SP.js",
            function() { 
              // $.getScript(scriptbase + "init.js",
              //   function() { 
              // $.getScript(scriptbase + "SP.UserProfiles.js", 
              //   function() {
              $.getScript(scriptbase + "SP.RequestExecutor.js", execCrossDomainRequest)
            }); 
          //  })
          //});
        }
        );
    });
  }

  function execCrossDomainRequest() {
    var messageText = "Hello World!";    
    
    // context: The ClientContext object provides access to
    //          the web and lists objects.
    // factory: Initialize the factory object with the app web URL
    // var context = new SP.ClientContext(appweburl);
    // var factory = new SP.ProxyWebRequestExecutorFactory(appweburl);
    // context.set_webRequestExecutorFactory(factory); 

    // var context = SP.ClientContext.get_current();
    // var user = context.get_web().get_currentUser();
    // context.load(user);
    // context.executeQueryAsync(function() {
    //   console.log("welcome: ", user.get_title());
    // }, function(sender, args) {
    //   console.log(args);
    // });
    // var peopleManager = new SP.UserProfiles.PeopleManager(context);
    // var personProperties = peopleManager.getMyProperties();
    // context.load(personProperties);
    // context.executeQueryAsync(function(sender, args) {
    //   var properties = personProperties.get_userProfileProperties();
    //   for (var key in properties) {
    //     messageText += "<br />[" + key + "]: \"" + properties[key] + "\"";
    //   }
    //   //$get("results").innerHTML = messageText;
    // }, function(sender, args) { alert('Error: ' + args.get_message()); });
    
    // SP.SOD.executeOrDelayUntilScriptLoaded(function() {
    //   var context = SP.ClientContext.get_current();
    //   var peopleManager = new SP.UserProfiles.PeopleManager(context);
    //   var personProperties = peopleManager.getMyProperties();
    //   context.load(personProperties);
    //   context.executeQueryAsync(function(sender, args) {
    //     var properties = personProperties.get_userProfileProperties();
    //     for (var key in properties) {
    //       messageText += "<br />[" + key + "]: \"" + properties[key] + "\"";
    //     }
    //     //$get("results").innerHTML = messageText;
    //   }, function(sender, args) { alert('Error: ' + args.get_message()); });
    // }, 'sp.userprofiles.js')
    console.log(messageText);
  }

  angular
    .module("productManagement")
    .controller("ProductListCtrl", ProductListCtrl);
}