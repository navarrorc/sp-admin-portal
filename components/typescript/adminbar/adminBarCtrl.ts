module app.adminbar {	
	class AdminBarCtrl {
    name: string;    
    
		static $inject = ["dataAccessService"];
    constructor(private dataAccessService: app.common.DataAccessService) {
      this.name = "";

      this.name = dataAccessService.getName();
    }
	}
	
	angular
		.module("adminPortal")
		.controller("AdminBarCtrl", AdminBarCtrl);
}