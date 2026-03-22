"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateNoticeDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_notice_dto_1 = require("./create-notice.dto");
class UpdateNoticeDto extends (0, mapped_types_1.PartialType)(create_notice_dto_1.CreateNoticeDto) {
}
exports.UpdateNoticeDto = UpdateNoticeDto;
//# sourceMappingURL=update-notice.dto.js.map