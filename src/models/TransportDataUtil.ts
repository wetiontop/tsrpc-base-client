import { TSBuffer } from "tsbuffer";
import { ApiReturn, ServerInputData, ServerOutputData, TransportDataProto, TsrpcError } from 'tsrpc-proto';
import { BaseClient } from "..";
import { ApiService, MsgService, ServiceMap } from "./ServiceMapUtil";

export type ParsedServerInput = { type: 'api', service: ApiService, req: any, sn?: number } | { type: 'msg', service: MsgService, msg: any };
export type ParsedServerOutput = { type: 'api', service: ApiService, sn?: number, ret: ApiReturn<any> } | { type: 'msg', service: MsgService, msg: any };

export class TransportDataUtil {

    private static _tsbuffer?: TSBuffer;
    static get tsbuffer(): TSBuffer {
        if (!this._tsbuffer) {
            this._tsbuffer = new TSBuffer(TransportDataProto)
        }

        return this._tsbuffer;
    }

    static encodeApiReturn(tsbuffer: TSBuffer, service: ApiService, apiReturn: ApiReturn<any>, type: 'text', sn?: number): EncodeOutputText
    static encodeApiReturn(tsbuffer: TSBuffer, service: ApiService, apiReturn: ApiReturn<any>, type: 'buffer', sn?: number): EncodeOutputBuf
    static encodeApiReturn(tsbuffer: TSBuffer, service: ApiService, apiReturn: ApiReturn<any>, type: 'text' | 'buffer', sn?: number): EncodeOutputBuf | EncodeOutputText;
    static encodeApiReturn(tsbuffer: TSBuffer, service: ApiService, apiReturn: ApiReturn<any>, type: 'text' | 'buffer', sn?: number): EncodeOutputBuf | EncodeOutputText {
        if (type === 'buffer') {
            let serverOutputData: ServerOutputData = {
                sn: sn,
                serviceId: sn !== undefined ? service.id : undefined
            };
            if (apiReturn.isSucc) {
                let op = tsbuffer.encode(apiReturn.res, service.resSchemaId);
                if (!op.isSucc) {
                    return op;
                }
                serverOutputData.buffer = op.buf;
            }
            else {
                serverOutputData.error = apiReturn.err;
            }

            let op = this.tsbuffer.encode(serverOutputData, 'ServerOutputData');
            return op.isSucc ? { isSucc: true, output: op.buf } : { isSucc: false, errMsg: op.errMsg };
        }
        else {
            apiReturn = { ...apiReturn };
            if (apiReturn.isSucc) {
                let op = tsbuffer.encodeJSON(apiReturn.res, service.resSchemaId);
                if (!op.isSucc) {
                    return op;
                }
                apiReturn.res = op.json;
            }
            else {
                apiReturn.err = {
                    ...apiReturn.err
                }
            }
            let text = JSON.stringify(sn == undefined ? apiReturn : [service.name, apiReturn, sn]);
            return { isSucc: true, output: text };
        }
    }

    static encodeClientMsg(tsbuffer: TSBuffer, service: MsgService, msg: any, type: 'buffer', clientType: BaseClient<any>['type']): EncodeOutputBuf;
    static encodeClientMsg(tsbuffer: TSBuffer, service: MsgService, msg: any, type: 'text', clientType: BaseClient<any>['type']): EncodeOutputText;
    static encodeClientMsg(tsbuffer: TSBuffer, service: MsgService, msg: any, type: 'text' | 'buffer', clientType: BaseClient<any>['type']): EncodeOutputBuf | EncodeOutputText;
    static encodeClientMsg(tsbuffer: TSBuffer, service: MsgService, msg: any, type: 'text' | 'buffer', clientType: BaseClient<any>['type']): EncodeOutputBuf | EncodeOutputText {
        if (type === 'buffer') {
            let op = tsbuffer.encode(msg, service.msgSchemaId);
            if (!op.isSucc) {
                return op;
            }
            let serverInputData: ServerOutputData = {
                serviceId: service.id,
                buffer: op.buf
            }
            let opOut = this.tsbuffer.encode(serverInputData, 'ServerInputData');
            return opOut.isSucc ? { isSucc: true, output: opOut.buf } : { isSucc: false, errMsg: opOut.errMsg };
        }
        else {
            let op = tsbuffer.encodeJSON(msg, service.msgSchemaId);
            if (!op.isSucc) {
                return op;
            }
            return { isSucc: true, output: JSON.stringify(clientType === 'SHORT' ? op.json : [service.name, op.json]) };
        }
    }

    static encodeApiReq(tsbuffer: TSBuffer, service: ApiService, req: any, type: 'buffer', sn?: number): EncodeOutputBuf;
    static encodeApiReq(tsbuffer: TSBuffer, service: ApiService, req: any, type: 'text', sn?: number): EncodeOutputText;
    static encodeApiReq(tsbuffer: TSBuffer, service: ApiService, req: any, type: 'text' | 'buffer', sn?: number): EncodeOutputBuf | EncodeOutputText;
    static encodeApiReq(tsbuffer: TSBuffer, service: ApiService, req: any, type: 'text' | 'buffer', sn?: number): EncodeOutputBuf | EncodeOutputText {
        if (type === 'buffer') {
            let op = tsbuffer.encode(req, service.reqSchemaId);
            if (!op.isSucc) {
                return op;
            }
            let serverInputData: ServerInputData = {
                serviceId: service.id,
                buffer: op.buf,
                sn: sn
            }
            let opOut = this.tsbuffer.encode(serverInputData, 'ServerInputData');
            return opOut.isSucc ? { isSucc: true, output: opOut.buf } : { isSucc: false, errMsg: opOut.errMsg };
        }
        else {
            let op = tsbuffer.encodeJSON(req, service.reqSchemaId);
            if (!op.isSucc) {
                return op;
            }
            return { isSucc: true, output: JSON.stringify(sn === undefined ? op.json : [service.name, op.json, sn]) };
        }
    }

    static encodeServerMsg(tsbuffer: TSBuffer, service: MsgService, msg: any, type: 'buffer', clientType: BaseClient<any>['type']): EncodeOutputBuf;
    static encodeServerMsg(tsbuffer: TSBuffer, service: MsgService, msg: any, type: 'text', clientType: BaseClient<any>['type']): EncodeOutputText;
    static encodeServerMsg(tsbuffer: TSBuffer, service: MsgService, msg: any, type: 'text' | 'buffer', clientType: BaseClient<any>['type']): EncodeOutputBuf | EncodeOutputText;
    static encodeServerMsg(tsbuffer: TSBuffer, service: MsgService, msg: any, type: 'text' | 'buffer', clientType: BaseClient<any>['type']): EncodeOutputBuf | EncodeOutputText {
        if (type === 'buffer') {
            let op = tsbuffer.encode(msg, service.msgSchemaId);
            if (!op.isSucc) {
                return op;
            }
            let serverOutputData: ServerOutputData = {
                serviceId: service.id,
                buffer: op.buf
            }
            let opOut = this.tsbuffer.encode(serverOutputData, 'ServerOutputData');
            return opOut.isSucc ? { isSucc: true, output: opOut.buf } : { isSucc: false, errMsg: opOut.errMsg };
        }
        else {
            let op = tsbuffer.encodeJSON(msg, service.msgSchemaId);
            if (!op.isSucc) {
                return op;
            }
            return { isSucc: true, output: JSON.stringify(clientType === 'SHORT' ? op.json : [service.name, op.json]) }
        }
    }

    static parseServerOutout(tsbuffer: TSBuffer, serviceMap: ServiceMap, data: Uint8Array | string, serviceId?: number): { isSucc: true, result: ParsedServerOutput } | { isSucc: false, errMsg: string } {
        if (typeof data === 'string') {
            let json: any;
            try {
                json = JSON.parse(data);
            }
            catch (e: any) {
                return { isSucc: false, errMsg: `Invalid input JSON: ${e.message}` };
            }
            let body: any;
            let sn: number | undefined;

            let service: ApiService | MsgService | undefined;

            if (serviceId == undefined) {
                if (!Array.isArray(json)) {
                    return { isSucc: false, errMsg: `Invalid server output format` };
                }
                let serviceName = json[0];
                service = serviceMap.apiName2Service[serviceName] ?? serviceMap.msgName2Service[serviceName];
                if (!service) {
                    return { isSucc: false, errMsg: `Invalid service name: ${serviceName} (from ServerOutputData)` };
                }
                body = json[1];
                sn = json[2];
            }
            else {
                service = serviceMap.id2Service[serviceId];
                if (!service) {
                    return { isSucc: false, errMsg: `Invalid service ID: ${serviceId}` };
                }
                body = json;
            }

            if (service.type === 'api') {
                let op = tsbuffer.decodeJSON(body, service.resSchemaId);
                if (!op.isSucc) {
                    return op;
                }
                return {
                    isSucc: true,
                    result: {
                        type: 'api',
                        service: service,
                        sn: sn,
                        ret: op.value as ApiReturn<any>
                    }
                };
            }
            else {
                let op = tsbuffer.decodeJSON(body, service.msgSchemaId);
                if (!op.isSucc) {
                    return op;
                }
                return {
                    isSucc: true,
                    result: {
                        type: 'msg',
                        service: service,
                        msg: op.value
                    }
                }
            }
        }
        else {
            let opServerOutputData = this.tsbuffer.decode<ServerOutputData>(data, 'ServerOutputData');
            if (!opServerOutputData.isSucc) {
                return opServerOutputData;
            }
            let serverOutputData = opServerOutputData.value;
            serviceId = serviceId ?? serverOutputData.serviceId;
            if (serviceId === undefined) {
                return { isSucc: false, errMsg: `Missing 'serviceId' in ServerOutput` };
            }

            let service = serviceMap.id2Service[serviceId];
            if (!service) {
                return { isSucc: false, errMsg: `Invalid service ID: ${serviceId} (from ServerOutput)` };
            }

            if (service.type === 'msg') {
                if (!serverOutputData.buffer) {
                    return { isSucc: false, errMsg: 'Empty msg buffer (from ServerOutput)' };
                }
                let opMsg = tsbuffer.decode(serverOutputData.buffer, service.msgSchemaId);
                if (!opMsg.isSucc) {
                    return opMsg;
                }

                return {
                    isSucc: true,
                    result: {
                        type: 'msg',
                        service: service,
                        msg: opMsg.value
                    }
                }
            }
            else {
                if (serverOutputData.error) {
                    return {
                        isSucc: true,
                        result: {
                            type: 'api',
                            service: service,
                            sn: serverOutputData.sn,
                            ret: {
                                isSucc: false,
                                err: new TsrpcError(serverOutputData.error)
                            }
                        }
                    }
                }
                else {
                    if (!serverOutputData.buffer) {
                        return { isSucc: false, errMsg: 'Empty API res buffer (from ServerOutput)' };
                    }

                    let opRes = tsbuffer.decode(serverOutputData.buffer, service.resSchemaId);
                    if (!opRes.isSucc) {
                        return opRes;
                    }

                    return {
                        isSucc: true,
                        result: {
                            type: 'api',
                            service: service,
                            sn: serverOutputData.sn,
                            ret: {
                                isSucc: true,
                                res: opRes.value,
                            }
                        }
                    }
                }
            }
        }

    }

}

/** @public */
export declare type EncodeOutputText = {
    isSucc: true;
    /** Encoded binary buffer */
    output: string;
    errMsg?: undefined;
} | {
    isSucc: false;
    /** Error message */
    errMsg: string;
    output?: undefined;
};
export declare type EncodeOutputBuf = {
    isSucc: true;
    /** Encoded binary buffer */
    output: Uint8Array;
    errMsg?: undefined;
} | {
    isSucc: false;
    /** Error message */
    errMsg: string;
    output?: undefined;
};