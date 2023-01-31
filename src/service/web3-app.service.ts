import {Injectable, Logger} from "@nestjs/common";
import {TransferData, Web3AppResponse} from "../dto/web3-app.response.dto";
import {GraphService} from "./graph.service";
import {BigNumber, ethers} from "ethers";

@Injectable()
export class Web3AppService {

    private readonly logger: Logger = new Logger(Web3AppService.name);

    constructor(private readonly graphService: GraphService) {}

    async getGraphData(): Promise<Web3AppResponse> {
        this.logger.log("calling graph ql service");
        let web3AppResponse = new Web3AppResponse();
        let results = await this.graphService.getAllTransfers();
        web3AppResponse.status = "Success";
        web3AppResponse.transfers = [];
        if (results && results.transfers) {
            results.transfers.forEach((transfer) => {
                if (transfer) {
                   const transferData = new TransferData();
                   transferData.from = transfer.from;
                   transferData.to = transfer.to;
                   transferData.value = ethers.utils.formatUnits(BigNumber.from(transfer.value), 18);
                   transferData.blockTimestamp = transfer.blockTimestamp;
                   web3AppResponse.transfers.push(transferData);
                }
            });
        }
        return web3AppResponse;
    }
}
