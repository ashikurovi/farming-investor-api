"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateInvestorTypeDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_investor_type_dto_1 = require("./create-investor-type.dto");
class UpdateInvestorTypeDto extends (0, mapped_types_1.PartialType)(create_investor_type_dto_1.CreateInvestorTypeDto) {
}
exports.UpdateInvestorTypeDto = UpdateInvestorTypeDto;
//# sourceMappingURL=update-investor-type.dto.js.map