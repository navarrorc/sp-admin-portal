/// <reference path="./../../typings/angularjs/angular.d.ts" />
/// <reference path="./../../typings/angularjs/angular-resource.d.ts" />
/// <reference path="./../../typings/angularjs/angular-mocks.d.ts" />
/// <reference path="./../../typings/angularjs/angular-route.d.ts" />
/// <reference path="./../../typings/sharepoint/SharePoint.d.ts" />
module app {
	var main = angular.module("adminPortal",
		["ngRoute",
			"common.services",
			//"productResourceMock"
			]);

	main.config(routeConfig);

	routeConfig.$inject = ["$routeProvider"];
	function routeConfig($routeProvider: ng.route.IRouteProvider): void {
		$routeProvider
			.when("/dashboard",
				{
					templateUrl: "/views/dashboard/dashboard.html",
					controller: "DashboardCtrl as vm"
				})
			.when("/post",
				{
					templateUrl: "/views/post/post.html",
					controller: "PostCtrl as vm"
				})
			.when("/media",
				{
					templateUrl: "/views/media/media.html",
					controller: "MediaCtrl as vm"
				})
			// .when("/productDetail/:productId",
			// 	{
			// 		templateUrl: "/views/products/productDetailView.html",
			// 		controller: "ProductDetailCtrl as vm"
			// 	})
			.otherwise("/dashboard");
	}
}