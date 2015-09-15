module app.adminbar {	
	class AdminBarCtrl {
    name: string;
		pictureUrl: string;    
    
		static $inject = ["DataAccessService", "$scope"];
    constructor(private DataAccessService: app.common.DataAccessService, $scope: ng.IScope) {
      var vm = this;
			vm.name = "";
			vm.pictureUrl = "";
						
			// DataAccessService.getUser().then(function(user:SP.User){				
			// 	vm.name = user.get_title();
			// 	console.info("username: ", vm.name);
			// 	//$scope is not updating so force with this command
			// 	if (!$scope.$$phase) {$scope.$apply();}				
			// })
			
			DataAccessService.getProfile().then(function(properties: any){
				vm.name = properties["FirstName"];
				vm.pictureUrl = properties["PictureURL"];
				var messageText = "";
			  for (let key in properties) {
            messageText += "<br />[" + key + "]: \"" + properties[key] + "\"";
        }
				
				if (!$scope.$$phase) {$scope.$apply();}	
				//console.info(messageText);
			})
			
    }
	}
	
	angular
		.module("adminPortal")
		.controller("AdminBarCtrl", AdminBarCtrl);
}