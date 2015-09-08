module app.adminbar {	
	class AdminBarCtrl {
    name: string;    
    
		static $inject = ["dataAccessService", "$scope"];
    constructor(private dataAccessService: app.common.DataAccessService, $scope: ng.IScope) {
      var vm = this;

      // dataAccessService.getName().then(function(user:SP.User) {
			// 	console.log("before vm.name", vm.name);
				
			// 	vm.name = user.get_title();
			// });
			//vm.name = dataAccessService.getName();
			vm.name = "";
			dataAccessService.getName().then(function(user:SP.User){				
				vm.name = user.get_title();
				//$scope is not updating so force with this command
				if (!$scope.$$phase) {$scope.$apply();}
				
				console.info("user name: ", vm.name);
			})
    }
	}
	
	angular
		.module("adminPortal")
		.controller("AdminBarCtrl", AdminBarCtrl);
}