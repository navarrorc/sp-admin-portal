module app.common {
	var web: SP.Web,
		hostweburl: string,
		appweburl: string
		//user: SP.User;

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

	/**
	 * Current User
	 */
	function getSPCurrentUser(): JQueryPromise<{}> {
		var context: SP.ClientContext,
			factory: SP.ProxyWebRequestExecutorFactory,
			appContextSite: SP.AppContextSite,
			user: SP.User;

		var deferred = $.Deferred();

		context = new SP.ClientContext(appweburl);
		factory = new SP.ProxyWebRequestExecutorFactory(appweburl);
		context.set_webRequestExecutorFactory(factory);
		appContextSite = new SP.AppContextSite(context, appweburl);

		web = appContextSite.get_web();
		user = web.get_currentUser();

		context.load(user);
		context.executeQueryAsync(
			function() {
				deferred.resolve(user);
			},
			function(sender: any, args: any) {
				deferred.reject(sender, args);
			}
		);

		return deferred.promise();
	}
	
	/**
	 * User Profile
	 */
	function getSPUserProfile() {
		var context: SP.ClientContext,
		factory: SP.ProxyWebRequestExecutorFactory,
		appContextSite: SP.AppContextSite,
		peopleManager: SP.UserProfiles.PeopleManager,
		personProperties: SP.UserProfiles.PersonProperties;

		var deferred = $.Deferred();
		
		SP.SOD.executeOrDelayUntilScriptLoaded(getProperties, 'sp.userprofiles.js');
		function getProperties() {
			//console.info("inside getProperties()");

			context = new SP.ClientContext(appweburl);
			factory = new SP.ProxyWebRequestExecutorFactory(appweburl);
			context.set_webRequestExecutorFactory(factory);
			appContextSite = new SP.AppContextSite(context, appweburl);


			peopleManager = new SP.UserProfiles.PeopleManager(context);

			personProperties = peopleManager.getMyProperties();

			context.load(personProperties);

			context.executeQueryAsync(
				function() {
					var properties = personProperties.get_userProfileProperties();
					//console.info("first name: ", properties["FirstName"]);
					deferred.resolve(properties);
				},
				function(sender: any, args: any) {
					deferred.reject(sender, args);
				}
				);
		}	
		
		return deferred.promise();		
		
	}

	var sharePointReady = function() {
		hostweburl = decodeURIComponent(getQueryStringParameter('SPHostUrl'));
    appweburl = decodeURIComponent(getQueryStringParameter('SPAppWebUrl'));
    var scriptbase = hostweburl + '/_layouts/15/';
		return {
			// Get the current SP.User using CSOM
			getUser: function() {
				return $.when(
					$.getScript(scriptbase + 'init.js'),
					$.getScript(scriptbase + 'SP.Core.js'),
					$.getScript(scriptbase + 'SP.Runtime.js'),
					$.getScript(scriptbase + 'SP.js'),
					$.getScript(scriptbase + 'SP.RequestExecutor.js'),
					$.Deferred(function(deferred) {
						$(deferred.resolve);
					})
					).then(getSPCurrentUser); // returns a JQueryPromise<{}>
			},
			getUserProfile: function() {
				return $.when(
					// $.getScript(scriptbase + 'init.js', 
					// 	function() {
					// 		$.getScript(scriptbase + 'SP.Runtime.js', 
					// 			function() {
					// 				$.getScript(scriptbase + 'SP.js', 
					// 					function() {
					// 						$.getScript(scriptbase + 'SP.Taxonomy.js', 
					// 							function() {
					// 								$.getScript(scriptbase + 'SP.UserProfiles.js',
					// 									function() {
					// 										$.getScript(scriptbase + 'SP.RequestExecutor.js')
					// 									})
					// 							})
					// 					})
					// 			})
					// 	})					
					// $.getScript(scriptbase + 'init.js'),					
					$.getScript(scriptbase + 'SP.RequestExecutor.js'),
						$.Deferred(function(deferred) {
							$(deferred.resolve);
						})
					).then(getSPUserProfile); // returns a JQueryPromise<{}>
			}
			
		}
	}

	export class DataAccessService {
		constructor() {
		}

		getUser() {
			return sharePointReady().getUser();
		}
		
		getProfile() {
			return sharePointReady().getUserProfile();
		}
	}

	angular
		.module("common.services")
		.service("DataAccessService",
						DataAccessService);
}