module app.dashboard {	
	class DashboardCtrl {
    name: string;    
    
		static $inject = ["dataAccessService"];
    constructor(private dataAccessService: app.common.DataAccessService) {
      // this.name = "";

      // this.name = dataAccessService.getName();
    }
	}
	
	angular
		.module("adminPortal")
		.controller("DashboardCtrl", DashboardCtrl);
}