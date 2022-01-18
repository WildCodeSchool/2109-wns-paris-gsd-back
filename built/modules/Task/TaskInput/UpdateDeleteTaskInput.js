"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var type_graphql_1 = require("type-graphql");
var Task_1 = require("../../../entity/Task");
var UpdateDeleteTaskInput = /** @class */ (function () {
    function UpdateDeleteTaskInput() {
    }
    __decorate([
        (0, type_graphql_1.Field)(),
        __metadata("design:type", Number)
    ], UpdateDeleteTaskInput.prototype, "id", void 0);
    __decorate([
        (0, type_graphql_1.Field)({ nullable: true }),
        __metadata("design:type", String)
    ], UpdateDeleteTaskInput.prototype, "title", void 0);
    __decorate([
        (0, type_graphql_1.Field)({ nullable: true }),
        __metadata("design:type", String)
    ], UpdateDeleteTaskInput.prototype, "description", void 0);
    __decorate([
        (0, type_graphql_1.Field)({ nullable: true }),
        __metadata("design:type", Number)
    ], UpdateDeleteTaskInput.prototype, "advancement", void 0);
    __decorate([
        (0, type_graphql_1.Field)({ nullable: true }),
        __metadata("design:type", String)
    ], UpdateDeleteTaskInput.prototype, "status", void 0);
    __decorate([
        (0, type_graphql_1.Field)(function () { return Date; }, { nullable: true }),
        __metadata("design:type", Date)
    ], UpdateDeleteTaskInput.prototype, "ending_time", void 0);
    UpdateDeleteTaskInput = __decorate([
        (0, type_graphql_1.InputType)()
    ], UpdateDeleteTaskInput);
    return UpdateDeleteTaskInput;
}());
exports.default = UpdateDeleteTaskInput;
//# sourceMappingURL=UpdateDeleteTaskInput.js.map