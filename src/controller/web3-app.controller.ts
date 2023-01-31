import {Controller, Get, Header, HttpCode, Request} from "@nestjs/common";
import {Web3AppService} from "../service/web3-app.service";
import {
    ApiBadRequestResponse,
    ApiForbiddenResponse,
    ApiInternalServerErrorResponse,
    ApiOkResponse,
    ApiUnauthorizedResponse
} from "@nestjs/swagger";
import {Web3AppResponse} from "../dto/web3-app.response.dto";

@Controller()
export class Web3AppController {
    constructor(private readonly web3AppService : Web3AppService) {
    }


    @Get("/v1/get-graph-data")
    @ApiOkResponse({
        description: "Get broad category and token",
        type: Web3AppResponse,
    })
    @ApiUnauthorizedResponse({ description: "Invalid Credentials" })
    @ApiForbiddenResponse({ description: "Forbidden" })
    @ApiInternalServerErrorResponse({ description: "Internal server error" })
    @HttpCode(200)
    @ApiBadRequestResponse({ description: "Bad Request" })
    @Header("Cache-Control", "no-store, no-cache")
    async getAssetCategoryMetatdata(@Request() req: any): Promise<Web3AppResponse> {
        return await this.web3AppService.getGraphData();
    }
}
