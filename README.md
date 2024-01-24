# ![Logo](wsPlayerlogo.svg) wsPlayer

​       wsPlayer是一款专注于WebSocket-fmp4协议的web视频播放器，HTTP/WebSocket-fmp4协议与RTMP、HLS、HTTP-FLV相比，具有播放延时短，HTML5兼容性好等优点；

见各流媒体协议对比：


|    协议名称    | 网络传输协议 | 延时  |        编码类型        |         HTML5支持情况          |
| :------------: | :----------: | :---: | :--------------------: | :----------------------------: |
|      RTSP      | TCP/UDP/组播 | 0~3s  |       H264/H265        | 不支持，（RTSP over HTTP除外） |
|      RTMP      |     TCP      | 0~3s  | H264/H265(CodecID =12) |             不支持             |
|      HLS       |  HTTP短连接  | 1~10s |       H264/H265        |         video标签支持          |
|    HTTP-FLV    |  HTTP长连接  | 0~3s  | H264/H265(CodecID =12) |     flv → fmp4 → video标签     |
|   HTTP-fmp4    |  HTTP长连接  | 0~3s  |       H264/H265        |       video标签原生支持        |
| WebSocket-FLV  |  WebSocket   | 0~3s  | H264/H265(CodecID =12) |     flv → fmp4 → video标签     |
| WebSocket-fmp4 |  WebSocket   | 0~3s  |       H264/H265        |     使用MSE，vidoe标签播放     |

备注：浏览器对单个页面的HTTP长连接的并发数限制为6个，这意味着HTTP-FLV、HTTP-fmp4只能同时播放6个视频画面；但浏览器对WebSocket的连接数没有限制；



## 项目依赖

需要使用[mp4box.js](https://github.com/gpac/mp4box.js)来解析fmp4 moov中的codecs；



## 快速开始

推荐使用[ZLMediaKit](https://github.com/ZLMediaKit/ZLMediaKit)作为WebSocket-fmp4协议的后端流媒体服务器

1. 部署后端流媒体服务器

```shell
docker pull panjjo/zlmediakit
docker run -id -p 8080:80 -p 554:554 panjjo/zlmediakit
```

2. 使用ffmpeg命令，向ZLMediaKit添加一路RTSP推流
```shell
ffmpeg -re -stream_loop -1 -i test.mp4 -an -vcodec copy -f rtsp -rtsp_transport tcp rtsp://100.100.154.29/live/test
```

3. 根据ZLMediaKit的[播放url规则](https://github.com/zlmediakit/ZLMediaKit/wiki/%E6%92%AD%E6%94%BEurl%E8%A7%84%E5%88%99)得知，WebSocket-fmp4协议的URL格式为：
```shell
ws://100.100.154.29:8080/live/test.live.mp4
```

4. 然后调用播放器代码：

```html
<html>
<head>
</head>
<body>
    <script type="text/javascript" src="mp4box.all.min.js"></script>
    <script type="text/javascript" src="wsPlayer.js"></script>
    <video muted autoplay id="video"></video>
    <script>
        document.addEventListener('DOMContentLoaded', function () {
            var player = new wsPlayer("video", "ws://100.100.154.29:8083/live/test.live.mp4");
            player.open();
        });
    </script>
</body>
</html>
```
## 5. magic-videoplayer
原本打算起名wsplayer，但是wsplayer的项目名称在npm公共仓库中已经被使用，顾起名`magic-videoplayer`
magic-videoplayer 基于 react 开发,支持主流的播放器功能 以及主流的视频格式和功能 以及判别视频文件属于哪类视频格式，支持多个播放器同步播放时间校正 #使用

#项目里使用

```
npm i magic-videoplayer --save
或
yarn add magic-videoplayer
```

# Player 播放器

视频播放器

## 代码演示

```tsx
import React, { useEffect, useState } from 'react';
import { Player } from 'magic-videoplayer';

const Play = () => {
  const [url, setUrl] = useState('');
  const [ref, setRef] = useState('');
  const [wsUrl, setWsUrl] = useState('');
  const [width, setWidth] = useState(700);

  return (
    <div>
      <div style={{ width }}>
        <Player
          url={url}
          onRef={(s) => {
            setRef(s);
          }}
          extra={<div style={{ color: '#fff', lineHeight: '30px' }}>额外按钮</div>}
          onPtzChange={(ptz) => {
            console.log(ptz, 'ptzchange');
          }}
          onError={() => {
            console.log('错误onerr');
          }}
          reconnection
          onPlay={(w, h, type) => {
            console.log({ w, h, type });
          }}
          emptyurlPrompt="请选择摄像头"
          onFullChange={(full) => {
            console.log(full);
          }}
        ></Player>
      </div>
    </div>
  );
};

export default () => <Play />;
```

## API

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| url | 视频地址 直播为 ws 开头 片段为 http 开头 | <font color='#c41d7f'>string</font> | - |
| onError | 播放错误时的回调 | <font color='#c41d7f'> ()=>void </font> | - |
| onPlay | 直播流开始播放的回调 | <font color='#c41d7f'> (videoWidth: number, videoHeight: number,videoType:string) => void </font> | - |
| autoPlay | 直播流是否自动播放 | <font color='#c41d7f'> boolean</font> | true |
| reconnection | 是否开启断线重连 | <font color='#c41d7f'> boolean </font> | false |
| onRef | 组件的 ref 引用 | <font color='#c41d7f'> (ref:any)=>void</font> | - |
| extra | 控制台额外的标签 | <font color='#c41d7f'> ReactNode \| (() => ReactNode) </font> | - |
| videoClass | video 暴露 class | <font color='#c41d7f'> string </font> | - |
| canvasClass | canvas 暴露 class | <font color='#c41d7f'> string </font> | - |
| screenshot | 是否显示截图按钮 | <font color='#c41d7f'>boolean</font> | false |
| closeControlBar | 关闭底部控制栏(仅在直播流有效) | <font color='#c41d7f'>boolean</font> | false |
| banfullscreen | 禁止播放器全屏(仅在直播流有效) | <font color='#c41d7f'>boolean</font> | false |
| emptyurlPrompt | 播放地址为空时的提示内容 | <font color='#c41d7f'> string</font> | - |

## 播放器原理
​       将WebSocket收到的fmp4 Segment片段`appendBuffer`到`MediaSource`中，此时`video.buffered`会记录当前已经`appendBuffer`的视频时间段，然后将`video.buffered`的起始时间设置给`video.currentTime`，然后浏览器就会从`video.buffered`缓存的视频开始播放

## 项目计划
* v1.0 实现用video标签，调用MSE播放WebSocket-fmp4（H.264）直播流，并把播放器封装为标准的npm组件；
* v2.0 实现用WebAssembly FFmpeg解码H.265，然后用canvas标签WebGL渲染YUV，从而实现播放WebSocket-fmp4（H.265）直播流，并实现动态切换H.264、H.265这两种播放机制；
* v3.0 实现视频流SEI信息的callback回调

## 联系方式
- QQ交流群：群名称：wsPlayer  群号：710185138
