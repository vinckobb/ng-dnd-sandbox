import {Injectable} from '@angular/core';
import {HttpRequest, HttpResponse} from '@angular/common/http';
import {RESTClient, BaseUrl, DefaultHeaders, MockLogger} from '@anglr/rest';

import {config} from '../../../config';

/**
 * Service for logging responses for mocks
 */
@Injectable()
@BaseUrl(config.configuration.apiBaseUrl)
@DefaultHeaders(config.configuration.defaultApiHeaders)
export class RestMockLoggerService extends RESTClient implements MockLogger
{
    //######################### public methods #########################

    /**
     * @inheritdoc
     */
    public async logResponse(request: HttpRequest<unknown>, response: HttpResponse<string|ArrayBuffer|Blob|object>): Promise<void>
    {
        //Do nothing
    }
}