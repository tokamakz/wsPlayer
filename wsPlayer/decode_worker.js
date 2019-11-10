"use strict";

(function() {
    importScripts('video_decoder.js');
    let memoryData = null;
    Module.onRuntimeInitialized = function () {
        let ret = Module._video_decoder_init(1);
        memoryData = Module._malloc(1024*1024);
        postMessage({
            command:"loaded"
        });
     };

    onmessage = function(evt) {           
        let edata = new Uint8Array(evt.data);
        Module.HEAPU8.set(edata, memoryData);
        let pImageData = Module._video_decode_frame(memoryData, edata.byteLength);
        if (pImageData === 0) {
            console.error("[ERROR] no Frame Data!");
            return;
        }
        
        let memoryIndex = pImageData / 4;
        let width = Module.HEAPU32[memoryIndex],
            height = Module.HEAPU32[memoryIndex + 1],
            YimgBufferPtr = Module.HEAPU32[memoryIndex + 2],
            UimgBufferPtr = Module.HEAPU32[memoryIndex + 3],
            VimgBufferPtr = Module.HEAPU32[memoryIndex + 4],
            YimageBuffer = Module.HEAPU8.subarray(YimgBufferPtr, YimgBufferPtr + width * height),
            UimageBuffer = Module.HEAPU8.subarray(UimgBufferPtr, UimgBufferPtr + width * height / 4),
            VimageBuffer = Module.HEAPU8.subarray(VimgBufferPtr, VimgBufferPtr + width * height / 4);

        let ydata = new Uint8Array(YimageBuffer);
        let udata = new Uint8Array(UimageBuffer);
        let vdata = new Uint8Array(VimageBuffer);
        postMessage({
            command:"video",
            width:width,
            height:height,
            YData:ydata.buffer,
            UData:udata.buffer,
            VData:vdata.buffer,
        }, [ydata.buffer, udata.buffer, vdata.buffer]); 
    }
})();