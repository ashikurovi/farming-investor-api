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
exports.Deed = void 0;
const typeorm_1 = require("typeorm");
const investment_entity_1 = require("../../investment/entities/investment.entity");
let Deed = class Deed {
};
exports.Deed = Deed;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Deed.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'investment_id', nullable: true }),
    __metadata("design:type", Number)
], Deed.prototype, "investmentId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => investment_entity_1.Investment, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'investment_id' }),
    __metadata("design:type", investment_entity_1.Investment)
], Deed.prototype, "investment", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Deed.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Deed.prototype, "file", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'upload_pdf', nullable: true }),
    __metadata("design:type", String)
], Deed.prototype, "uploadPdf", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'issue_date', type: 'date', nullable: true }),
    __metadata("design:type", String)
], Deed.prototype, "issueDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Deed.prototype, "signature", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp with time zone' }),
    __metadata("design:type", Date)
], Deed.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp with time zone' }),
    __metadata("design:type", Date)
], Deed.prototype, "updatedAt", void 0);
exports.Deed = Deed = __decorate([
    (0, typeorm_1.Entity)('tbl_deeds')
], Deed);
//# sourceMappingURL=deed.entity.js.map