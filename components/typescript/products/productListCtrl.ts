module app.productList {
  interface IProductListModel {
    title: string;
    showImage: boolean;
    products: app.domain.IProduct[];
    toggleImage(): void;
  }
  
  /**
   * JSOM 
   */
  var web: SP.Web,
    hostweburl: string,
    appweburl: string;


  function printAllListNamesFromHostWeb() {
    var context: SP.ClientContext;
    var factory: SP.ProxyWebRequestExecutorFactory;
    var appContextSite: SP.AppContextSite;
    var configList: SP.List;
    var collListItems: SP.ListItemCollection;
    var user: SP.User;
    
    SP.SOD.executeOrDelayUntilScriptLoaded(() => {
      context = new SP.ClientContext(appweburl);
      factory = new SP.ProxyWebRequestExecutorFactory(appweburl);
      context.set_webRequestExecutorFactory(factory);
      appContextSite = new SP.AppContextSite(context, appweburl);
  
  
      // trying out SP.UserProfiles.js
      //var peopleManager = new SP.UserProfiles.PeopleManager(context);
      //var personProperties = peopleManager.getMyProperties();
      ////////////////////////////////
  
      web = appContextSite.get_web();
      user = web.get_currentUser();
      //configList = web.get_lists().getByTitle('Configuration Values');
      //var camlQuery = new SP.CamlQuery();
      //collListItems = configList.getItems(camlQuery);
      //context.load(personProperties);
      context.load(user);
      //context.load(collListItems, "Include(Title, Value)");
      context.executeQueryAsync(onGetConfigValuesSuccess, onGetConfigValuesFail);
  
      function onGetConfigValuesSuccess() {
        // var OrgName: string;
        // var listItemEnumerator = collListItems.getEnumerator();
  
        // while (listItemEnumerator.moveNext()) {
        //   var oListItem = listItemEnumerator.get_current();
        //   try {
        //     var current = oListItem.get_item('Title');
        //   } catch (error) {
        //     console.log("Something went Wrong!", error);
        //     alert("Something went Wrong! "+ error);
        //   }
  
        //   switch (current) {
        //     case 'OrganizationName':
        //       try {
        //         OrgName = oListItem.get_item('Value');
        //       } catch (error) {
        //         console.log("Something went wrong!",error);
        //         alert("Something went wrong! "+error);
        //       }           
        //       break;
        //     default:
        //       break;
        //   }
        // }
        
        //User Profiles output
        //var properties = personProperties.get_userProfileProperties();
        //var messageText = "";
        // for (var key in properties){
        //   messageText += "<br/>[" + key + "]: \"" + properties[key] + "\"";
        // }
        ////////////////
        
        
        //if (OrgName && OrgName.length > 0) {
          document.getElementById("message").innerHTML = "<br/><div style='text-align: center; color: black;'>Current user: " + user.get_title() +"<br/></div><br/>";
        //}
      }
  
      function onGetConfigValuesFail(sender: any, args: any) {
        alert('Failed to get Configuration Values. Error:' + args.get_message());
      }
    }, 'sp.userprofiles.js');

  }

  function getQueryStringParameter(param: string) {
    var params = document.URL.split("?")[1].split("&");
    var strParams = "";
    for (var i = 0; i < params.length; i = i + 1) {
      var singleParam = params[i].split("=");
      if (singleParam[0] == param) {
        return singleParam[1];
      }
    }
  }

  function sharePointReady() {
    hostweburl =
    decodeURIComponent(
      getQueryStringParameter('SPHostUrl')
      );
    appweburl =
    decodeURIComponent(
      getQueryStringParameter('SPAppWebUrl')
      );

    var scriptbase = hostweburl + '/_layouts/15/';

    $.getScript(scriptbase + 'init.js',
      function() {$.getScript(scriptbase + 'sp.core.js',      
        function() { $.getScript(scriptbase + 'SP.Runtime.js',
          function() { $.getScript(scriptbase + 'SP.js',
              function() { $.getScript(scriptbase + 'SP.UserProfiles.js',
                  function(){$.getScript(scriptbase + 'SP.RequestExecutor.js', printAllListNamesFromHostWeb);}
               );}
           );}
        );}
      );} 
   );
   
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
       * Testing JSOM code
       */
      sharePointReady();
    }

    toggleImage(): void {
      this.showImage = !this.showImage;
    }
  }


  angular
    .module("productManagement")
    .controller("ProductListCtrl", ProductListCtrl);
}