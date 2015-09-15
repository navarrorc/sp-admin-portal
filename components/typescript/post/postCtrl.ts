module app.post {	
	
	// interface IPostModel {
	// 	clickMe(): void;
	// }
	
	class PostCtrl{			
		constructor(){			
		}
		
		clickMe():void {
			console.info("I was clicked :)");
			// SP.SOD.execute
		}		
		
	}
	
	angular
		.module("adminPortal")
		.controller("PostCtrl", PostCtrl);
}