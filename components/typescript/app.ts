/// <reference path="./../../typings/angularjs/angular.d.ts" />
/// <reference path="./../../typings/angularjs/angular-resource.d.ts" />
/// <reference path="./../../typings/angularjs/angular-mocks.d.ts" />
module app {
	angular.module("productManagement", 
									["common.services",
										"productResourceMock"]);
}