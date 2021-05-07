<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [tsrpc-base-client](./tsrpc-base-client.md) &gt; [TransportDataUtil](./tsrpc-base-client.transportdatautil.md) &gt; [parseServerOutout](./tsrpc-base-client.transportdatautil.parseserveroutout.md)

## TransportDataUtil.parseServerOutout() method

<b>Signature:</b>

```typescript
static parseServerOutout(tsbuffer: TSBuffer, serviceMap: ServiceMap, buf: Uint8Array, serviceId?: number): {
        isSucc: true;
        result: ParsedServerOutput;
    } | {
        isSucc: false;
        errMsg: string;
    };
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  tsbuffer | TSBuffer |  |
|  serviceMap | [ServiceMap](./tsrpc-base-client.servicemap.md) |  |
|  buf | Uint8Array |  |
|  serviceId | number |  |

<b>Returns:</b>

{ isSucc: true; result: [ParsedServerOutput](./tsrpc-base-client.parsedserveroutput.md)<!-- -->; } \| { isSucc: false; errMsg: string; }
