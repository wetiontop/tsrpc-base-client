<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [tsrpc-base-client](./tsrpc-base-client.md) &gt; [IWebSocketProxy](./tsrpc-base-client.iwebsocketproxy.md) &gt; [options](./tsrpc-base-client.iwebsocketproxy.options.md)

## IWebSocketProxy.options property

<b>Signature:</b>

```typescript
options: {
        onOpen: () => void;
        onClose: (code: number, reason: string) => void;
        onError: (e: Error) => void;
        onMessage: (data: Uint8Array | string) => void;
        logger?: Logger;
    };
```
