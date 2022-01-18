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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusName = void 0;
/* eslint-disable import/no-cycle */
var typeorm_1 = require("typeorm");
var type_graphql_1 = require("type-graphql");
var Comment_1 = __importDefault(require("./Comment"));
var Project_1 = __importDefault(require("./Project"));
var User_1 = __importDefault(require("./User"));
var Asset_1 = __importDefault(require("./Asset"));
var StatusName;
(function (StatusName) {
    StatusName["NEW"] = "NEW";
    StatusName["IN_PROGRESS"] = "IN PROGRESS";
    StatusName["PENDING_REVIEW"] = "PENDING REVIEW";
    StatusName["DONE"] = "DONE";
    StatusName["REJECTED"] = "REJECTED";
})(StatusName = exports.StatusName || (exports.StatusName = {}));
// registerEnumType(StatusName, {
//   name: "StatusName", // this one is mandatory
//   description: "name of status", // this one is optional
// });
var Task = /** @class */ (function (_super) {
    __extends(Task, _super);
    function Task() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Task.prototype.estimated_time = function (task) {
        var begin = new Date(task.starting_time);
        var end = new Date(task.ending_time);
        var estimee = Math.round((end.getTime() - begin.getTime()) / 1000 / 3600 / 24);
        return estimee;
    };
    __decorate([
        (0, type_graphql_1.Field)(function () { return type_graphql_1.ID; }),
        (0, typeorm_1.PrimaryGeneratedColumn)(),
        __metadata("design:type", Number)
    ], Task.prototype, "id", void 0);
    __decorate([
        (0, type_graphql_1.Field)(),
        (0, typeorm_1.Column)({ type: 'varchar' }),
        __metadata("design:type", String)
    ], Task.prototype, "title", void 0);
    __decorate([
        (0, type_graphql_1.Field)(),
        (0, typeorm_1.Column)({ type: 'text' }),
        __metadata("design:type", String)
    ], Task.prototype, "description", void 0);
    __decorate([
        (0, type_graphql_1.Field)(),
        (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
        __metadata("design:type", Date)
    ], Task.prototype, "starting_time", void 0);
    __decorate([
        (0, type_graphql_1.Field)(),
        (0, typeorm_1.Column)(),
        __metadata("design:type", Date)
    ], Task.prototype, "ending_time", void 0);
    __decorate([
        (0, type_graphql_1.Field)(function () { return Number; }, { nullable: true }),
        __param(0, (0, type_graphql_1.Root)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Task]),
        __metadata("design:returntype", void 0)
    ], Task.prototype, "estimated_time", null);
    __decorate([
        (0, type_graphql_1.Field)(),
        (0, typeorm_1.Column)({ type: 'int' }),
        __metadata("design:type", Number)
    ], Task.prototype, "advancement", void 0);
    __decorate([
        (0, type_graphql_1.Field)(),
        (0, typeorm_1.Column)({
            type: 'text',
        }),
        __metadata("design:type", String)
    ], Task.prototype, "status", void 0);
    __decorate([
        (0, type_graphql_1.Field)(function () { return [Comment_1.default]; }),
        (0, typeorm_1.OneToMany)(function () { return Comment_1.default; }, function (comment) { return comment.task; }),
        __metadata("design:type", Array)
    ], Task.prototype, "comments", void 0);
    __decorate([
        (0, type_graphql_1.Field)(function () { return Project_1.default; }),
        (0, typeorm_1.ManyToOne)(function () { return Project_1.default; }, function (project) { return project.tasks; }),
        (0, typeorm_1.JoinColumn)({ name: 'project_id', referencedColumnName: 'id' }),
        __metadata("design:type", Project_1.default
        //! maybe change name of taskCreator by assignee / smthg else
        )
    ], Task.prototype, "project", void 0);
    __decorate([
        (0, type_graphql_1.Field)(function () { return User_1.default; }),
        (0, typeorm_1.ManyToOne)(function () { return User_1.default; }, function (user) { return user.tasks; }),
        (0, typeorm_1.JoinColumn)({ name: 'user_id', referencedColumnName: 'id' }),
        __metadata("design:type", User_1.default)
    ], Task.prototype, "taskCreator", void 0);
    __decorate([
        (0, type_graphql_1.Field)(function () { return [Asset_1.default]; }),
        (0, typeorm_1.OneToMany)(function () { return Asset_1.default; }, function (asset) { return asset.task; }),
        __metadata("design:type", Array)
    ], Task.prototype, "assets", void 0);
    Task = __decorate([
        (0, typeorm_1.Entity)(),
        (0, type_graphql_1.ObjectType)()
    ], Task);
    return Task;
}(typeorm_1.BaseEntity));
exports.default = Task;
//# sourceMappingURL=Task.js.map