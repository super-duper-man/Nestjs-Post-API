import { applyDecorators, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiResponse } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/guards/jwt-auth/jwt-auth.guard";

export function createPostCompositeDecorator(arg: { apiParamName: string, apiParamDescription?: string, apiOperationSummary: string, apiResponseStatus: number, apiResponseDescription?: string; }) {
    return applyDecorators(
        UseGuards(JwtAuthGuard),
        ApiOperation({ summary: arg.apiOperationSummary }),
        ApiParam({ name: arg.apiParamName, description: arg.apiParamDescription }),
        ApiResponse({ status: arg.apiResponseStatus, description: arg.apiResponseDescription })
    );
}