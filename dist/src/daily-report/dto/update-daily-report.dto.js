"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDailyReportDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_daily_report_dto_1 = require("./create-daily-report.dto");
class UpdateDailyReportDto extends (0, mapped_types_1.PartialType)(create_daily_report_dto_1.CreateDailyReportDto) {
}
exports.UpdateDailyReportDto = UpdateDailyReportDto;
//# sourceMappingURL=update-daily-report.dto.js.map