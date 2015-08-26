/// <reference path="./../../typings/angularjs/angular.d.ts" />
/// <reference path="./../../typings/angularjs/angular-resource.d.ts" />
/// <reference path="./../../typings/angularjs/angular-mocks.d.ts" />
/// <reference path="./../../typings/angularjs/angular-route.d.ts" />
module app {
	var main = angular.module("productManagement",
		["ngRoute",
			"common.services",
			"productResourceMock"]);

	main.config(routeConfig);

	routeConfig.$inject = ["$routeProvider"];
	function routeConfig($routeProvider: ng.route.IRouteProvider): void {
		$routeProvider
			.when("/productList",
				{
					templateUrl: "/views/products/productListView.html",
					controller: "ProductListCtrl as vm"
				})
			.when("/productDetail/:productId",
				{
					templateUrl: "/views/products/productDetailView.html",
					controller: "ProductDetailCtrl as vm"
				})
			.otherwise("/productList");
	}
}