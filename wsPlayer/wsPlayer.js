"use strict";

function wsPlayer(videoCanvasId, wsUrl) {
    if (!window.WebAssembly) {
        console.error('Web Browser not support WebAssembly!');
        return ;
    }
    this.videoCanvasId = videoCanvasId;
    this.wsUrl = wsUrl;
    this.SuperRender = null;
    this.ws = null;
    this.DecodeWorker = null;
}

wsPlayer.prototype.open = function () {
    this.SuperRender = new SuperRender2(this.videoCanvasId);
    if(null == this.SuperRender) {
        console.error("Web Browser not support WebGL!");
        return ;
    }
    this.DecodeWorker = new Worker("DecodeWorker.js");
    this.DecodeWorker.onmessage = function(evt) {
        switch(evt.data.command) {
            case "loaded":
                this.ws = new WebSocket(this.wsUrl);
                this.ws.binaryType = 'arraybuffer';
                this.ws.onmessage = function(evt) {
                    this.DecodeWorker.postMessage(evt.data, [evt.data]);
                }.bind(this);
                break;
            case "video":
                var width = evt.data.width;
                var height = evt.data.height;
                var ydata = new Uint8Array(evt.data.YData);
                var udata = new Uint8Array(evt.data.UData);
                var vdata = new Uint8Array(evt.data.VData);
                this.SuperRender.SR_DisplayFrameData(width, height, ydata, udata, vdata);
                break;
        }
    }.bind(this);
}

wsPlayer.prototype.close = function () {
    this.ws && this.ws.close();
    this.DecodeWorker && this.DecodeWorker.terminate();
    this.SuperRender && this.SuperRender.SR_Destroy();
}