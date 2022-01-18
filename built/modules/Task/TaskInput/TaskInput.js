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
var TaskInput = /** @class */ (function () {
    function TaskInput() {
    }
    __decorate([
        (0, type_graphql_1.Field)(),
        __metadata("design:type", String)
    ], TaskInput.prototype, "title", void 0);
    __decorate([
        (0, type_graphql_1.Field)(),
        __metadata("design:type", String)
    ], TaskInput.prototype, "description", void 0);
    __decorate([
        (0, type_graphql_1.Field)(),
        __metadata("design:type", Number)
    ], TaskInput.prototype, "advancement", void 0);
    __decorate([
        (0, type_graphql_1.Field)(),
        __metadata("design:type", String)
    ], TaskInput.prototype, "status", void 0);
    __decorate([
        (0, type_graphql_1.Field)(function () { return Date; }),
        __metadata("design:type", Date)
    ], TaskInput.prototype, "ending_time", void 0);
    __decorate([
        (0, type_graphql_1.Field)(function () { return type_graphql_1.ID; }),
        __metadata("design:type", Number)
    ], TaskInput.prototype, "creator_id", void 0);
    TaskInput = __decorate([
        (0, type_graphql_1.InputType)()
    ], TaskInput);
    return TaskInput;
}());
exports.default = TaskInput;
//# sourceMappingURL=TaskInput.js.map