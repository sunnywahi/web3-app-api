import {Injectable} from "@nestjs/common";
import {
    cacheExchange,
    Client,
    createClient,
    debugExchange,
    dedupExchange,
    errorExchange,
    fetchExchange, OperationResult
} from "@urql/core";
import {ConfigService} from "@nestjs/config";
import fetch from 'isomorphic-unfetch';

@Injectable()
export class GraphService {
    private client: Client;
    private baseUrl: string;

    constructor(
        private readonly configService: ConfigService
    ) {
        this.baseUrl = configService.get(`graph.url`);
        this.client = createClient({
            url: this.baseUrl,
            exchanges: [
                debugExchange,
                dedupExchange,
                cacheExchange,
                errorExchange({
                    onError(error) {
                        console.error("unable to execute graphql query", {error});
                    },
                }),
                fetchExchange,
            ],
            requestPolicy: 'cache-and-network',
            fetch: fetch,
        });
    }

    async getAllTransfers() {
        const query = `
        query GetAllTransfers {
            transfers {
                id
                from
                to
                value
                blockNumber
                blockTimestamp
              }
        }`;
        const result = await this.executeQuery(query, {});
        console.log("response from  GraphQl: ", result);
        return result;
    }

    async executeQuery(query: string, parameters: { [key: string]: any }, context?: { any }) {
        let result: OperationResult = await this.client.query(query, parameters).toPromise();
        console.debug("results for query is", {result});
        return result.data;
    }
}
