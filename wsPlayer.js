"use strict";

function wsPlayer(videoId, wsUrl) {
    this.videoId = videoId;
    this.wsUrl = wsUrl;
    this.ws = null;
    this.frameQueue = [];
}

wsPlayer.prototype.open = function () {
    let sourcebuffer = null;
    this.ws = new WebSocket(this.wsUrl);
    this.ws.binaryType = 'arraybuffer';
    let firstMessage = true;
    
    let demux_moov = function (info) {
        let codecs = [];
        for (let i = 0; i < info.tracks.length; i++) {
            codecs.push(info.tracks[i].codec);
        }
        let video = document.getElementById(this.videoId);
        let mediasource = new MediaSource();
        video.src = URL.createObjectURL(mediasource);
    
        mediasource.onsourceopen = function() {
            sourcebuffer = mediasource.addSourceBuffer('video/mp4; codecs="' + codecs.join(', ') + '"');
            sourcebuffer.onupdateend = function() {
                if(video.buffered.length > 0) {
                    let pos = video.currentTime;
                    let start = video.buffered.start(0);
                    //console.log("pos=" + pos + ",start=" + start);
                    if (pos < start) {
                        video.currentTime = start;
                    }
                }
            }
        }
    }.bind(this);

    this.ws.onmessage = function(e) {
        if(firstMessage) {
            firstMessage = false;
            let moov = e.data;
            let mp4Box = new MP4Box;
            mp4Box.onReady = demux_moov;
            moov.fileStart = 0;
            mp4Box.appendBuffer(moov);
        }
        this.frameQueue.push(e.data);
        if (!sourcebuffer || sourcebuffer.updating) {
            return;
        }
        sourcebuffer.appendBuffer(this.frameQueue.shift());
    }.bind(this);
}

wsPlayer.prototype.close = function () {
    this.ws && this.ws.close();
}