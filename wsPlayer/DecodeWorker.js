"use strict";

(function() {
    importScripts('Decoder.js');
    var video_decoder_ctx = 0;
    Module.onRuntimeInitialized = function () {
        video_decoder_ctx = Module._video_decoder_init();
        postMessage({
            command:"loaded"
        });
     };

    onmessage = function(evt) {             
        var edata = new Uint8Array(evt.data);
        var memoryData = Module._malloc(edata.byteLength);
        Module.HEAPU8.set(edata, memoryData);
        var ptr = Module._video_decode_frame(video_decoder_ctx, memoryData, edata.byteLength);
        Module._free(memoryData);
        if(ptr == 0) {
            console.error("[ERROR] no Frame Data!");
            return;
        }

        var width = Module.HEAPU32[ptr / 4],
            height = Module.HEAPU32[ptr / 4 + 1],
            YimgBufferPtr = Module.HEAPU32[ptr / 4 + 2],
            UimgBufferPtr = Module.HEAPU32[ptr / 4 + 3],
            VimgBufferPtr = Module.HEAPU32[ptr / 4 + 4],
            YimageBuffer = Module.HEAPU8.subarray(YimgBufferPtr, YimgBufferPtr + width * height),
            UimageBuffer = Module.HEAPU8.subarray(UimgBufferPtr, UimgBufferPtr + width * height / 4),
            VimageBuffer = Module.HEAPU8.subarray(VimgBufferPtr, VimgBufferPtr + width * height / 4);

        var ydata = new Uint8Array(YimageBuffer);
        var udata = new Uint8Array(UimageBuffer);
        var vdata = new Uint8Array(VimageBuffer);
    
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