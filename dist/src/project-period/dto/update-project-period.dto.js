"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProjectPeriodDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_project_period_dto_1 = require("./create-project-period.dto");
class UpdateProjectPeriodDto extends (0, mapped_types_1.PartialType)(create_project_period_dto_1.CreateProjectPeriodDto) {
}
exports.UpdateProjectPeriodDto = UpdateProjectPeriodDto;
//# sourceMappingURL=update-project-period.dto.js.map