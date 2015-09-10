var app;
(function (app) {
    var common;
    (function (common) {
        var web, hostweburl, appweburl;
        //user: SP.User;
        function getQueryStringParameter(param) {
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
        function getSPCurrentUser() {
            var context, factory, appContextSite, user;
            var deferred = $.Deferred();
            context = new SP.ClientContext(appweburl);
            factory = new SP.ProxyWebRequestExecutorFactory(appweburl);
            context.set_webRequestExecutorFactory(factory);
            appContextSite = new SP.AppContextSite(context, appweburl);
            web = appContextSite.get_web();
            user = web.get_currentUser();
            context.load(user);
            context.executeQueryAsync(function () {
                deferred.resolve(user);
            }, function (sender, args) {
                deferred.reject(sender, args);
            });
            return deferred.promise();
        }
        /**
         * User Profile
         */
        function getSPUserProfile() {
            var context, factory, appContextSite, peopleManager, personProperties;
            var deferred = $.Deferred();
            console.info("outside getProperties()");
            //SP.SOD.executeOrDelayUntilScriptLoaded(getProperties, 'sp.js');
            //function getProperties() {
            console.info("inside getProperties()");
            context = new SP.ClientContext(appweburl);
            factory = new SP.ProxyWebRequestExecutorFactory(appweburl);
            context.set_webRequestExecutorFactory(factory);
            appContextSite = new SP.AppContextSite(context, appweburl);
            peopleManager = new SP.UserProfiles.PeopleManager(context);
            personProperties = peopleManager.getMyProperties();
            context.load(personProperties);
            context.executeQueryAsync(function () {
                var properties = personProperties.get_userProfileProperties();
                console.info("first name: ", properties["FirstName"]);
                deferred.resolve(properties);
            }, function (sender, args) {
                deferred.reject(sender, args);
            });
            //}	
            return deferred.promise();
        }
        var sharePointReady = function () {
            hostweburl = decodeURIComponent(getQueryStringParameter('SPHostUrl'));
            appweburl = decodeURIComponent(getQueryStringParameter('SPAppWebUrl'));
            var scriptbase = hostweburl + '/_layouts/15/';
            return {
                // Get the current SP.User using CSOM
                getUser: function () {
                    return $.when($.getScript(scriptbase + 'init.js'), $.getScript(scriptbase + 'SP.Core.js'), $.getScript(scriptbase + 'SP.Runtime.js'), $.getScript(scriptbase + 'SP.js'), $.getScript(scriptbase + 'SP.RequestExecutor.js'), $.Deferred(function (deferred) {
                        $(deferred.resolve);
                    })).then(getSPCurrentUser); // returns a JQueryPromise<{}>
                },
                getUserProfile: function () {
                    return $.when($.getScript(scriptbase + 'init.js', function () {
                        $.getScript(scriptbase + 'SP.Runtime.js', function () {
                            $.getScript(scriptbase + 'SP.js', function () {
                                $.getScript(scriptbase + 'SP.Taxonomy.js', function () {
                                    $.getScript(scriptbase + 'SP.UserProfiles.js', function () {
                                        $.getScript(scriptbase + 'SP.RequestExecutor.js');
                                    });
                                });
                            });
                        });
                    }))
                        ?
                        :
                    ;
                } };
        };
        then(getSPUserProfile); // returns a JQueryPromise<{}>
    })(common = app.common || (app.common = {}));
})(app || (app = {}));
var DataAccessService = (function () {
    function DataAccessService() {
    }
    DataAccessService.prototype.getUser = function () {
        return sharePointReady().getUser();
    };
    DataAccessService.prototype.getProfile = function () {
        return sharePointReady().getUserProfile();
    };
    return DataAccessService;
})();
exports.DataAccessService = DataAccessService;
angular
    .module("common.services")
    .service("DataAccessService", DataAccessService);

//# sourceMappingURL=../../../../../../../d:/AppDev/sp-admin-portal/components/typescript/common/services/dataAccessService.js.map