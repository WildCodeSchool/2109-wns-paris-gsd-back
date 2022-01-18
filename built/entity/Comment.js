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
/* eslint-disable import/no-cycle */
var typeorm_1 = require("typeorm");
var type_graphql_1 = require("type-graphql");
var Task_1 = __importDefault(require("./Task"));
var User_1 = __importDefault(require("./User"));
var Comment = /** @class */ (function (_super) {
    __extends(Comment, _super);
    function Comment() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        (0, type_graphql_1.Field)(function () { return type_graphql_1.ID; }),
        (0, typeorm_1.PrimaryGeneratedColumn)(),
        __metadata("design:type", Number)
    ], Comment.prototype, "id", void 0);
    __decorate([
        (0, type_graphql_1.Field)(),
        (0, typeorm_1.Column)({ type: 'text' }),
        __metadata("design:type", String)
    ], Comment.prototype, "content", void 0);
    __decorate([
        (0, type_graphql_1.Field)(),
        (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
        __metadata("design:type", Date
        // I have to add the foreign key Column by hand if i want to query with find({foreignKey: number})
        )
    ], Comment.prototype, "createdAt", void 0);
    __decorate([
        (0, typeorm_1.Column)({ name: 'task_id' }),
        __metadata("design:type", Number)
    ], Comment.prototype, "taskId", void 0);
    __decorate([
        (0, type_graphql_1.Field)(function () { return Task_1.default; }),
        (0, typeorm_1.ManyToOne)(function () { return Task_1.default; }, function (task) { return task.comments; }),
        (0, typeorm_1.JoinColumn)({ name: 'task_id', referencedColumnName: 'id' }),
        __metadata("design:type", Task_1.default)
    ], Comment.prototype, "task", void 0);
    __decorate([
        (0, type_graphql_1.Field)(function () { return User_1.default; }),
        (0, typeorm_1.ManyToOne)(function () { return User_1.default; }, function (user) { return user.comments; }),
        (0, typeorm_1.JoinColumn)({ name: 'user_id', referencedColumnName: 'id' }),
        __metadata("design:type", User_1.default)
    ], Comment.prototype, "author", void 0);
    Comment = __decorate([
        (0, typeorm_1.Entity)(),
        (0, type_graphql_1.ObjectType)()
    ], Comment);
    return Comment;
}(typeorm_1.BaseEntity));
exports.default = Comment;
//# sourceMappingURL=Comment.js.map