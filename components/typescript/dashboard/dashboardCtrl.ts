module app.dashboard {	
	class DashboardCtrl {
    name: string;    
    
		static $inject = ["DataAccessService"];
    constructor(private DataAccessService: app.common.DataAccessService) {
      // var vm = this;

      // dataAccessService.getName().then(function(user:SP.User) {
			// 	console.log("before vm.name", vm.name);
				
			// 	vm.name = user.get_title();
			// });
    }
	}
	
	angular
		.module("adminPortal")
		.controller("DashboardCtrl", DashboardCtrl);
}