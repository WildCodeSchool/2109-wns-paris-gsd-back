"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleName = void 0;
/* eslint-disable import/no-cycle */
var typeorm_1 = require("typeorm");
var type_graphql_1 = require("type-graphql");
var User_1 = __importDefault(require("./User"));
var RoleName;
(function (RoleName) {
    RoleName["ADMIN"] = "ADMIN";
    RoleName["MANAGER"] = "MANAGER";
    RoleName["DEVELOPER"] = "DEVELOPER";
    RoleName["USER"] = "USER";
})(RoleName = exports.RoleName || (exports.RoleName = {}));
var Role = /** @class */ (function (_super) {
    __extends(Role, _super);
    function Role() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        (0, type_graphql_1.Field)(function () { return type_graphql_1.ID; }),
        (0, typeorm_1.PrimaryGeneratedColumn)(),
        __metadata("design:type", Number)
    ], Role.prototype, "id", void 0);
    __decorate([
        (0, type_graphql_1.Field)(),
        (0, typeorm_1.Column)({ type: 'text', default: RoleName.USER, unique: true }),
        __metadata("design:type", String)
    ], Role.prototype, "label", void 0);
    __decorate([
        (0, type_graphql_1.Field)(function () { return [User_1.default]; }),
        (0, typeorm_1.OneToMany)(function () { return User_1.default; }, function (user) { return user.role; }),
        __metadata("design:type", Array)
    ], Role.prototype, "users", void 0);
    Role = __decorate([
        (0, typeorm_1.Entity)(),
        (0, type_graphql_1.ObjectType)()
    ], Role);
    return Role;
}(typeorm_1.BaseEntity));
exports.default = Role;
//# sourceMappingURL=Role.js.map