"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateInvestmentDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_investment_dto_1 = require("./create-investment.dto");
class UpdateInvestmentDto extends (0, mapped_types_1.PartialType)(create_investment_dto_1.CreateInvestmentDto) {
}
exports.UpdateInvestmentDto = UpdateInvestmentDto;
//# sourceMappingURL=update-investment.dto.js.map