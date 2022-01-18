"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var type_graphql_1 = require("type-graphql");
var graphql_1 = require("graphql");
var User_1 = __importDefault(require("../../entity/User"));
var Task_1 = __importDefault(require("../../entity/Task"));
var TaskInput_1 = __importDefault(require("./TaskInput/TaskInput"));
var UpdateDeleteTaskInput_1 = __importDefault(require("./TaskInput/UpdateDeleteTaskInput"));
var ChangeAssigneeInput_1 = __importDefault(require("./TaskInput/ChangeAssigneeInput"));
// import {FieldResolver, Root } from "type-graphql";
// import Comment from "../../entity/Comment";
var TaskResolver = /** @class */ (function () {
    function TaskResolver() {
    }
    TaskResolver.prototype.getTasks = function () {
        return __awaiter(this, void 0, void 0, function () {
            var tasks;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Task_1.default.find({ relations: ['comments', "taskCreator", 'taskCreator.role'], })];
                    case 1:
                        tasks = _a.sent();
                        return [2 /*return*/, tasks];
                }
            });
        });
    };
    TaskResolver.prototype.addTask = function (_a) {
        var creator_id = _a.creator_id, taskData = __rest(_a, ["creator_id"]);
        return __awaiter(this, void 0, void 0, function () {
            var user, task;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, User_1.default.findOne({ id: creator_id })];
                    case 1:
                        user = _b.sent();
                        task = Task_1.default.create(__assign(__assign({}, taskData), { taskCreator: user }));
                        return [4 /*yield*/, task.save()];
                    case 2:
                        _b.sent();
                        return [2 /*return*/, task];
                }
            });
        });
    };
    TaskResolver.prototype.updateTaskbyID = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var updatedTask, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, Task_1.default.update(data.id, data)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, Task_1.default.findOne({ id: data.id })];
                    case 2:
                        updatedTask = _a.sent();
                        return [2 /*return*/, updatedTask];
                    case 3:
                        error_1 = _a.sent();
                        return [2 /*return*/, new graphql_1.GraphQLError('update Error')];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    TaskResolver.prototype.changeAssignee = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var task, newAssignee, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, Task_1.default.findOne({ id: data.id })];
                    case 1:
                        task = _a.sent();
                        return [4 /*yield*/, User_1.default.findOne({ id: data.creator_id }, { relations: ["role"] })];
                    case 2:
                        newAssignee = _a.sent();
                        task.taskCreator = newAssignee;
                        task.save();
                        return [2 /*return*/, task];
                    case 3:
                        error_2 = _a.sent();
                        return [2 /*return*/, new graphql_1.GraphQLError('new assignee error')];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    TaskResolver.prototype.deleTaskbyID = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var taskTodelete, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, Task_1.default.findOne({ id: data.id })];
                    case 1:
                        taskTodelete = _a.sent();
                        return [4 /*yield*/, Task_1.default.delete(data.id)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, taskTodelete];
                    case 3:
                        error_3 = _a.sent();
                        return [2 /*return*/, new graphql_1.GraphQLError('update Error')];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        (0, type_graphql_1.Query)(function () { return [Task_1.default]; }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], TaskResolver.prototype, "getTasks", null);
    __decorate([
        (0, type_graphql_1.Mutation)(function () { return Task_1.default; }),
        __param(0, (0, type_graphql_1.Arg)('data')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [TaskInput_1.default]),
        __metadata("design:returntype", Promise)
    ], TaskResolver.prototype, "addTask", null);
    __decorate([
        (0, type_graphql_1.Mutation)(function () { return Task_1.default; }),
        __param(0, (0, type_graphql_1.Arg)('data')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [UpdateDeleteTaskInput_1.default]),
        __metadata("design:returntype", Promise)
    ], TaskResolver.prototype, "updateTaskbyID", null);
    __decorate([
        (0, type_graphql_1.Mutation)(function () { return Task_1.default; }),
        __param(0, (0, type_graphql_1.Arg)('data')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [ChangeAssigneeInput_1.default]),
        __metadata("design:returntype", Promise)
    ], TaskResolver.prototype, "changeAssignee", null);
    __decorate([
        (0, type_graphql_1.Mutation)(function () { return Task_1.default; }),
        __param(0, (0, type_graphql_1.Arg)('data')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [UpdateDeleteTaskInput_1.default]),
        __metadata("design:returntype", Promise)
    ], TaskResolver.prototype, "deleTaskbyID", null);
    TaskResolver = __decorate([
        (0, type_graphql_1.Resolver)(Task_1.default)
    ], TaskResolver);
    return TaskResolver;
}());
exports.default = TaskResolver;
//# sourceMappingURL=Task.resolver.js.map