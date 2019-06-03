Introduction
============
wsPlayer is a web video player based on WebAssembly and WebGL. 


Features
========
* using WebAssembly to compile FFmpeg library for decode H.264 or HEVC stream.  
* using WebGL API to display YUV data which decoded by FFmpeg.


Installation
============

* How to compile FFmpeg with WebAssembly?  
1.downland FFmpeg source code from FFmpeg github webside.  
2.run this linux command:
```shell
emconfigure ./configure --prefix=../FFmpegLib_wasm --disable-logging --disable-parsers --disable-pixelutils --enable-avcodec --disable-decoders --enable-decoder=h264 --disable-demuxers --disable-debug --disable-asm --disable-small --disable-runtime-cpudetect --disable-autodetect --disable-programs --disable-doc --disable-avformat --disable-avdevice --disable-swresample --disable-swscale --disable-postproc --disable-avfilter --disable-pthreads --disable-w32threads --disable-os2threads --disable-network --disable-encoders --disable-hwaccels --disable-muxers  --disable-bsfs --disable-protocols --disable-indevs --disable-outdevs --disable-devices --disable-filters --disable-v4l2_m2m --disable-iconv  --arch=x86_64 --cpu=generic --enable-cross-compile --target-os=none --cc=emcc
```


Compatibility
============
WebAssembly Browser Compatibility:
    Chrome 57+  (Chrome 57 released in March 2017)  
    Internet Explorer NOT support  
Reference: https://developer.mozilla.org/zh-CN/docs/WebAssembly

WebGL2.0 Browser Compatibility：  
    Chrome 56+  (Chrome 56 released in February 2017)
    Internet Explorer NOT support    
Reference: https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext

Platform compatibility:
    WebAssembly support 32-bit and 64-bit browsers;
    WebGL2.0    support 32-bit and 64-bit browsers;
