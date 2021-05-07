<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [tsrpc-base-client](./tsrpc-base-client.md) &gt; [ParsedServerInput](./tsrpc-base-client.parsedserverinput.md)

## ParsedServerInput type

<b>Signature:</b>

```typescript
export declare type ParsedServerInput = {
    type: 'api';
    service: ApiService;
    req: any;
    sn?: number;
} | {
    type: 'msg';
    service: MsgService;
    msg: any;
};
```
<b>References:</b> [ApiService](./tsrpc-base-client.apiservice.md)<!-- -->, [MsgService](./tsrpc-base-client.msgservice.md)
