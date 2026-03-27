"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDeedDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_deed_dto_1 = require("./create-deed.dto");
class UpdateDeedDto extends (0, mapped_types_1.PartialType)(create_deed_dto_1.CreateDeedDto) {
}
exports.UpdateDeedDto = UpdateDeedDto;
//# sourceMappingURL=update-deed.dto.js.map