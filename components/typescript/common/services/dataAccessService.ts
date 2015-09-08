module app.common {
	var web: SP.Web,
		hostweburl: string,
		appweburl: string,
		user: SP.User;
	
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
	
	function getSPName(): JQueryPromise<{}> {		
			var context: SP.ClientContext,
				factory: SP.ProxyWebRequestExecutorFactory,
				appContextSite: SP.AppContextSite;
				
			var deferred = $.Deferred();
			myPromise: $.Deferred();
							
			context = new SP.ClientContext(appweburl);
			factory = new SP.ProxyWebRequestExecutorFactory(appweburl);
			context.set_webRequestExecutorFactory(factory);
			appContextSite = new SP.AppContextSite(context, appweburl);

			web = appContextSite.get_web();
			user = web.get_currentUser();

			context.load(user);
			context.executeQueryAsync(
				function () {
					//console.log("before dfd.resolve(user) username is", user.get_title());
					deferred.resolve(user);
				}, 
				function(sender:any, args:any) {
					//console.log("Something Wrong Happened!", args);
					deferred.reject(sender, args);					
				}
			);
			
			return deferred.promise();	
	}
	
	
	
	function sharePointReady() {
     hostweburl = decodeURIComponent(getQueryStringParameter('SPHostUrl'));
     appweburl = decodeURIComponent(getQueryStringParameter('SPAppWebUrl'));		 
     var scriptbase = hostweburl + '/_layouts/15/';
		 
		 return $.when(
			 $.getScript(scriptbase + 'init.js'),
			 $.getScript(scriptbase + 'sp.core.js'),
			 $.getScript(scriptbase + 'SP.Runtime.js'),
			 $.getScript(scriptbase + 'SP.js'),
			 $.getScript(scriptbase + 'SP.RequestExecutor.js'),
			 $.Deferred(function(deferred){
				 $(deferred.resolve);
			 })
			 
		 ).then(getSPName);
   }
	 
	export class DataAccessService {

		constructor() {
			//sharePointReady();
		}

		getName() {			
			return sharePointReady();
			// myPromise.then(function(user:SP.User){
			// 	console.info("SP.User username is: ", user.get_title());
			// })
			//return "Bob";
		}
	}
	
	angular
	.module("common.services")
	.service("dataAccessService",
						DataAccessService);
}