module app.common {
	var web: SP.Web,
		hostweburl: string,
		appweburl: string,
		username: string;
	
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
	
	function getSPName() {
		var context: SP.ClientContext,
			factory: SP.ProxyWebRequestExecutorFactory,
			appContextSite: SP.AppContextSite,
			user: SP.User;			
			
		context = new SP.ClientContext(appweburl);
		factory = new SP.ProxyWebRequestExecutorFactory(appweburl);
		context.set_webRequestExecutorFactory(factory);
		appContextSite = new SP.AppContextSite(context, appweburl);
		
		web = appContextSite.get_web();
		user = web.get_currentUser();		
		
		context.load(user);
		context.executeQueryAsync(onGetNameSuccess, onGetNameFailed);		
		
		function onGetNameSuccess() {
			username = user.get_title();
			console.log("username: ", username);
			//alert(username);
			$("#username").html("Howdy, " + username);
			
		}
		
		function onGetNameFailed(sender: any, args: any) {
			alert('Something went Wrong! ' + args.get_message());
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
                   function(){$.getScript(scriptbase + 'SP.RequestExecutor.js', getSPName);}
                );}
            );}
         );}
       );} 
    ); 
		
		//return username;
   }
	 
	export class DataAccessService {

		constructor() {
			sharePointReady();
		}

		getName(): string {			
			//return "Robertooo";
			//sharePointReady();
			return username;
		}
	}
	
	angular
	.module("common.services")
	.service("dataAccessService",
						DataAccessService);
}