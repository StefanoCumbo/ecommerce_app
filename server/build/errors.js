"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductErrors = exports.UserErrors = void 0;
var UserErrors;
(function (UserErrors) {
    UserErrors["NO_USER_FOUND"] = "no-user-found";
    UserErrors["WRONG_CREDENTIALS"] = "wrong-credentials";
    UserErrors["USERNAME_ALREADY_EXISTS"] = "username-already-exists";
})(UserErrors || (exports.UserErrors = UserErrors = {}));
var ProductErrors;
(function (ProductErrors) {
    ProductErrors["NO_PRODUCT_FOUND"] = "no-product-found";
    ProductErrors["NOT_ENOUGH_STOCK"] = "not-enough-stock";
    ProductErrors["NO_AVAILABLE_MONEY"] = "no-available-money";
})(ProductErrors || (exports.ProductErrors = ProductErrors = {}));
