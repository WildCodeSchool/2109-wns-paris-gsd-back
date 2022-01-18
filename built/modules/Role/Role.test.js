"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var apollo_server_express_1 = require("apollo-server-express");
var server_1 = __importDefault(require("../../server"));
var Role_1 = __importDefault(require("../../entity/Role"));
var server;
beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, server_1.default)()];
            case 1:
                server = _a.sent();
                return [2 /*return*/];
        }
    });
}); });
describe('role resolver', function () {
    describe('Query getRoles', function () {
        it('should get all roles', function () { return __awaiter(void 0, void 0, void 0, function () {
            var role, getRolesQuery, _a, data, errors, expectedResult;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        role = Role_1.default.create({
                            label: 'ADMIN',
                        });
                        return [4 /*yield*/, role.save()];
                    case 1:
                        _b.sent();
                        getRolesQuery = (0, apollo_server_express_1.gql)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n        query getRoles {\n          getRoles {\n            id\n            label\n          }\n        }\n      "], ["\n        query getRoles {\n          getRoles {\n            id\n            label\n          }\n        }\n      "])));
                        return [4 /*yield*/, server.executeOperation({
                                query: getRolesQuery,
                            })];
                    case 2:
                        _a = _b.sent(), data = _a.data, errors = _a.errors;
                        expect(!errors).toBeTruthy();
                        return [4 /*yield*/, Role_1.default.find()];
                    case 3:
                        expectedResult = _b.sent();
                        data.getRoles[0].id = +data.getRoles[0].id;
                        expect(data.getRoles).toEqual(expect.arrayContaining(expectedResult));
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('mutation addRole', function () {
        it("should add a role if label in ['ADMIN', 'USER', MANAGER, 'DEVELOPER']", function () { return __awaiter(void 0, void 0, void 0, function () {
            var addRoleMutation, variables, _a, data, errors, expectedResult;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        addRoleMutation = (0, apollo_server_express_1.gql)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n        mutation AddRole($data: RoleInput!) {\n          addRole(data: $data) {\n            label\n          }\n        }\n      "], ["\n        mutation AddRole($data: RoleInput!) {\n          addRole(data: $data) {\n            label\n          }\n        }\n      "])));
                        variables = {
                            data: {
                                label: "ADMIN"
                            }
                        };
                        return [4 /*yield*/, server.executeOperation({
                                query: addRoleMutation,
                                variables: variables,
                            })];
                    case 1:
                        _a = _b.sent(), data = _a.data, errors = _a.errors;
                        expect(!errors).toBeTruthy();
                        return [4 /*yield*/, Role_1.default.findOne({ label: 'ADMIN' })];
                    case 2:
                        expectedResult = _b.sent();
                        expect(data.addRole).toEqual(expect.objectContaining({ label: expectedResult.label }));
                        return [2 /*return*/];
                }
            });
        }); });
        //! doesn't work because of fucking sqlite 3 not having enums
        //   it (`should render error if label NOT in ['ADMIN', 'USER', MANAGER, 'DEVELOPER']`, async () => {
        //     const addRoleMutation = gql`
        //     mutation AddRole($data: RoleInput!) {
        //       addRole(data: $data) {
        //         label
        //       }
        //     }
        //   `
        //     const variables = {
        //       data: {
        //         label: "pouet"
        //       }
        //     }
        //   const { data, errors } = await server.executeOperation({
        //     query: addRoleMutation,
        //     variables,
        //   })
        //   console.log(errors)
        //   console.log(data)
        //   // expect(!data && errors).toBeTruthy();
        // })
    });
});
var templateObject_1, templateObject_2;
//# sourceMappingURL=Role.test.js.map