"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlarryModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const glarry_service_1 = require("./glarry.service");
const glarry_controller_1 = require("./glarry.controller");
const glarry_entity_1 = require("./entities/glarry.entity");
const project_entity_1 = require("../projects/entities/project.entity");
let GlarryModule = class GlarryModule {
};
exports.GlarryModule = GlarryModule;
exports.GlarryModule = GlarryModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([glarry_entity_1.GlarryEntity, project_entity_1.ProjectEntity])],
        controllers: [glarry_controller_1.GlarryController],
        providers: [glarry_service_1.GlarryService],
    })
], GlarryModule);
//# sourceMappingURL=glarry.module.js.map