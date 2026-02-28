"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const users_module_1 = require("./users/users.module");
const uploads_module_1 = require("./uploads/uploads.module");
const banner_module_1 = require("./banner/banner.module");
const project_period_module_1 = require("./project-period/project-period.module");
const auth_module_1 = require("./auth/auth.module");
const projects_module_1 = require("./projects/projects.module");
const investments_module_1 = require("./investments/investments.module");
const glarry_module_1 = require("./glarry/glarry.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (configService) => {
                    return {
                        type: 'postgres',
                        url: process.env.DATABASE_URL,
                        autoLoadEntities: true,
                        synchronize: true,
                        logging: true,
                        ssl: {
                            rejectUnauthorized: false,
                        },
                    };
                },
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            uploads_module_1.UploadsModule,
            banner_module_1.BannerModule,
            project_period_module_1.ProjectPeriodModule,
            projects_module_1.ProjectsModule,
            investments_module_1.InvestmentsModule,
            glarry_module_1.GlarryModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map