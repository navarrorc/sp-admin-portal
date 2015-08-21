/// <reference path="../../typings/tsd.d.ts" />
var app;
(function (app) {
    angular.module("productManagement", []);
})(app || (app = {}));
/// <reference path="../../../typings/tsd.d.ts" />
var app;
(function (app) {
    var productList;
    (function (productList) {
        var ProductListCtrl = (function () {
            function ProductListCtrl() {
                this.title = "Product List";
                this.showImage = false;
                this.products = [
                    {
                        "productId": 1,
                        "productName": "Leaf Rake",
                        "productCode": "GDN-0011",
                        "releaseDate": new Date(2009, 2, 19),
                        "description": "Leaf rake with 48-inch wooden handle.",
                        "price": 19.95,
                        "imageUrl": "http://openclipart.org/image/300px/svg_to_png/26215/Anonymous_Leaf_Rake.png"
                    },
                    {
                        "productId": 2,
                        "productName": "Garden Cart",
                        "productCode": "GDN-0023",
                        "releaseDate": new Date(2010, 2, 18),
                        "description": "15 gallon capacity rolling garden cart",
                        "price": 32.99,
                        "imageUrl": "http://openclipart.org/image/300px/svg_to_png/58471/garden_cart.png"
                    },
                    {
                        "productId": 5,
                        "productName": "Hammer",
                        "productCode": "TBX-0048",
                        "releaseDate": new Date(2013, 4, 21),
                        "description": "Curved claw steel hammer",
                        "price": 8.99,
                        "imageUrl": "http://openclipart.org/image/300px/svg_to_png/73/rejon_Hammer.png"
                    }
                ];
                var newProduct = new app.domain.Product(5, "Saw", "TBX-002", new Date(2002, 3, 1), 16.95, "15-inch steel blade hand saw", "http://openclipart.org/image/300px/svg_to_png/27070/egore911_saw.png");
                newProduct.price = newProduct.calculateDiscount(10);
                this.products.push(newProduct);
            }
            ProductListCtrl.prototype.toggleImage = function () {
                this.showImage = !this.showImage;
            };
            return ProductListCtrl;
        })();
        angular
            .module("productManagement")
            .controller("ProductListCtrl", ProductListCtrl);
    })(productList = app.productList || (app.productList = {}));
})(app || (app = {}));
var app;
(function (app) {
    var domain;
    (function (domain) {
        var Product = (function () {
            function Product(productId, productName, productCode, releaseDate, price, description, imageUrl) {
                this.productId = productId;
                this.productName = productName;
                this.productCode = productCode;
                this.releaseDate = releaseDate;
                this.price = price;
                this.description = description;
                this.imageUrl = imageUrl;
            }
            Product.prototype.calculateDiscount = function (percent) {
                return this.price - (this.price * percent / 100);
            };
            return Product;
        })();
        domain.Product = Product;
    })(domain = app.domain || (app.domain = {}));
})(app || (app = {}));
