//@ts-nocheck
import { CameraOutlined, PlayCircleOutlined, RedoOutlined } from '@ant-design/icons';
import fullscreenIcon from './images/fullscreen.png';
import pauseIcon from './images/pause.png';
import playIcon from './images/play.png';
import $ from 'jquery';
import React, { Component, createRef } from 'react';
import './index.less';
//@ts-ignore
import vmplayer, { Version } from './vmplayer';
import _ from 'lodash-es';
import moment from 'moment';
import {
  computedFontSizeFun,
  fullElement,
  renderContentMenuElement,
  renderVideoInfoElement,
} from './utils';

import {
  moveButton,
  TDataType,
  VideoPattern,
  VideoType,
  WsPlayerProps,
  WsPlayerState,
} from './PlayerInterface';

export default class PlayerCon extends Component<WsPlayerProps, WsPlayerState> {
  public videoElement!: HTMLVideoElement;
  public pointCanvas!: HTMLCanvasElement;
  public videoCanvas!: HTMLCanvasElement;

  private timeHandler?: NodeJS.Timeout;
  private urlChangeTime?: NodeJS.Timeout;
  private curentTimer?: NodeJS.Timeout;
  private fontSize?: number;
  reloadFlg: boolean = false;
  private resizeObserver: ResizeObserver = new ResizeObserver(
    _.throttle(() => {
      this.computedFontSize();
    }, 300),
  );

  static defaultProps: any;

  constructor(props: WsPlayerProps) {
    super(props);
    this.state = {
      id: Math.random().toString(36).substring(2),
      playerExample: {
        open: () => {},
        close: () => {},
      },
      showControl: false, // 云台显示
      status: 'normal', // 播放状态
      videoType: '', // 'hardwareDecoding' | 'softwareDecoding' | 'primordial' | '';
      fullscreen: false, //是否全屏
      playerRef: createRef(),
      fontSizeType: 'default',
      mediaInfo: { width: 1920, height: 1080 },
      currentPTZInfo: undefined, // 当前预设位位置
      errorMsg: '播放错误', //错误信息model 文字
      showContextMenu: false,
      showVideoInfoPanel: false,
      videoInfo: {},
      currentTime: '',
      videoTime: 0,
      canvasStyles: {},
    };
  }
  componentDidMount() {
    const { url, onRef, autoPlay } = this.props;
    const { id } = this.state;
    this.eventListen();

    if (onRef) {
      onRef(this);
    }

    const videoElement = document.getElementById(`newPlayer${id}`) as HTMLVideoElement;
    const pointCanvas = document.getElementById(`point${id}`) as HTMLCanvasElement;
    const videoCanvas = document.getElementById(`canvas${id}`) as HTMLCanvasElement;
    if (!videoElement || !videoCanvas) {
      console.log('未初始化Video元素!');
      return;
    }
    this.videoElement = videoElement;
    this.pointCanvas = pointCanvas;
    this.videoCanvas = videoCanvas;

    if (!url) {
      // 如果 url 为空字符串就什么都不做 如果为其他空便为错误地址
      this.setState({
        status: url !== '' ? 'urlerr' : 'emptyurl',
      });
      return;
    }

    if (autoPlay) {
      this.init();
    }
  }

  componentDidUpdate(prevProps: Readonly<WsPlayerProps>): void {
    if (prevProps.url !== this.props.url) {
      this.reloadFlg = false;
      this.urlChangeTime && clearTimeout(this.urlChangeTime);
      //@ts-ignore
      this.state.status = 'normal';
      this.addEventListenerClickModel(false);
      // 解决切换URL 时框卡住的现象
      this.videoElement.onerror = () => {};
      /** 解决265视频关闭后残留最后一帧的现象 */
      var ctx = this.videoCanvas?.getContext('webgl2', {
        preserveDrawingBuffer: true,
      });
      ctx && ctx.clearColor(0, 0, 0, 0);
      ctx && ctx.clear(ctx.COLOR_BUFFER_BIT | ctx.DEPTH_BUFFER_BIT);

      if (!this.props.url) {
        this.state.playerExample?.close();
        this.setState({
          status: this.props.url !== '' ? 'urlerr' : 'emptyurl',
          videoInfo: {},
        });
        this.videoElement.src = '';
      } else {
        this.setState({
          mediaInfo: { width: 1920, height: 1080 },
          videoInfo: {},
        });
        this.state.playerExample?.close();
        this.urlChangeTime = setTimeout(() => {
          if (this.props.autoPlay) {
            this.init();
          }
        }, 1000);
      }
    }
  }

  computeTextElementFontSizeRatio = (width?: number, defaultWidth = 1920) => {
    const ratio = (width || this.getPointCanvasDOM().width) / defaultWidth;
    return ratio;
  };

  setTextElementFontSize = (ratio = 1, fontSize = 20) => {
    this.fontSize = ratio * fontSize;
  };

  /** 初始化 并播放 */
  init = (delayTime?: number) => {
    const { id } = this.state;
    const { url, onError, reconnection, onPlay, delayTimeStamp } = this.props;
    const reloadFlg = this.reloadFlg;
    const videoEle = this.videoElement;

    this.setState({
      status: 'loading',
      currentPTZInfo: undefined,
    });
    if (!videoEle) {
      return;
    }
    videoEle.onerror = () => {};
    videoEle.onplay = () => {};
    this.stopCacheCheckLoop();
    if (!url) {
      this.setState({
        status: url !== '' ? 'urlerr' : 'emptyurl',
      });
      return;
    }
    //httpmp4直接赋给video 并监听错误
    if (url.slice(0, 4) === 'http' && url.slice(-4) === '.mp4') {
      console.log('httpMP4');
      videoEle.src = url;
      this.setState({
        status: 'playing',
        videoType: 'primordial',
      });
      this.addEventListenerClickModel();
      //只有在 httpmp4时才监听video的错误信息 其他时候报错是由 vmplayer传出的
      videoEle.onerror = () => {
        onError && onError();
        this.setState({
          status: reloadFlg ? 'error' : 'reload',
          errorMsg: window.navigator.onLine
            ? '视频流地址不存在'
            : '网络异常，请检查网络连接情况后重试播放',
        });
      };
      videoEle.onplay = () => {
        onPlay && onPlay(videoEle.videoWidth, videoEle.videoHeight, '264', 'primordial');
        this.startCacheCheckLoop();
      };

      return;
    }
    videoEle.src = '';

    var player = new vmplayer(`canvas${id}`, `newPlayer${id}`, url);
    this.setState({
      playerExample: player,
    });

    const time = (delayTime ? delayTime : delayTimeStamp) || 0;
    player.open((errorMsg: string, reload = true) => {
      console.log(errorMsg, reload);
      onError && onError();
      this.setState({
        status: !reloadFlg && reload ? 'reload' : 'error',
        errorMsg,
      });
    }, time);

    //播放错误时
    player.onerror((errorMsg: string, reload = true) => {
      onError && onError();
      this.setState({
        status: !reloadFlg && reload ? 'reload' : 'error',
        errorMsg,
      });
    });

    //视频开始播放时
    player.onStartPlay((videoType: VideoType, videoPattern: '264' | '265') => {
      this.addEventListenerClickModel();
      this.videoElement.removeAttribute('videoPattern');

      this.setState({
        status: 'playing',
        videoType,
      });
      if (videoType === 'hardwareDecoding') {
        this.videoElement.addEventListener('play', this.videoOnPlay);
        this.videoElement.setAttribute('videoPattern', videoPattern);
      } else {
        this.videoElement.setAttribute('videoPattern', '265');
      }
    });

    player.onMediaInfoChange((mediaInfo: { width: number; height: number }) => {
      this.setState({ mediaInfo }, () => {
        this.videoOnPlay();
      });
    });

    player.onWsClose(() => {
      if (reconnection && this.state.status === 'playing') {
        this.init();
      }
    });

    player.onMediaStatus((data: string) => {
      this.state.showVideoInfoPanel &&
        this.setState({
          videoInfo: data || {},
        });
    });
  };

  /** 添加鼠标进入监听  */
  eventListen = () => {
    const { id } = this.state;
    ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange'].forEach((item) => {
      window.addEventListener(item, () => this.fullscreenchange());
    });
    this.computedFontSize();
    const newPlayerBox = $(this.state.playerRef?.current);
    this.resizeObserver.observe(newPlayerBox[0], { box: 'border-box' });

    newPlayerBox.mouseover(this.mouseover);
    newPlayerBox.mouseout(this.mouseout);
    $(`#playerControls${id}`).mouseover(this.mouseover);
  };

  fullscreenchange() {
    this.computedFontSize();
    this.calcCavasStyles();

    const fullScreenPlayer = document.fullscreenElement === this.state.playerRef?.current;
    fullScreenPlayer && console.log('播放器全屏', this.state.id);
    this.state.fullscreen !== fullScreenPlayer &&
      this.props.onFullChange &&
      this.props.onFullChange(fullScreenPlayer);
    this.setState({
      fullscreen: fullScreenPlayer, //进入/退出 全屏
    });
  }

  /**提示文字大小 */
  computedFontSize = () => {
    const playerWidth = this.state.playerRef?.current?.getBoundingClientRect().width;
    this.setState({
      fontSizeType: computedFontSizeFun(playerWidth),
    });
  };

  /*鼠标移入*/
  mouseover = (e: any) => {
    const { showControl } = this.state;
    e.stopPropagation();
    e.preventDefault();
    this.setState({
      showControl: true,
    });
  };

  /*鼠标移出*/
  mouseout = (e: any) => {
    this.setState({
      showControl: false,
    });
  };

  /** 全屏 */
  full = () => {
    fullElement(this.state.playerRef?.current);
  };

  /** 避免越播时间差距越大 */
  startCacheCheckLoop() {
    const clearCache = () => {
      const video = this.videoElement;
      if (!video) {
        return;
      }
      if (!video.paused) {
        const buffered = video.buffered;
        // console.log(buffered);
        if (buffered && buffered.length > 0) {
          const end = buffered.end(0);
          if (end - video.currentTime > 15) {
            video.currentTime = end - 8;
          }
        }
      }
    };

    this.stopCacheCheckLoop();
    if (this.props.ws) {
      this.timeHandler = setInterval(clearCache, 10000);
    }
  }

  stopCacheCheckLoop() {
    if (this.timeHandler) {
      clearInterval(this.timeHandler);
      this.timeHandler = undefined;
    }
  }

  /**暂停 */
  pause = () => {
    this.setState({
      status: 'pause',
    });
    if (this.state.videoType === 'primordial') {
      this.videoElement.pause();
    } else {
      this.state?.playerExample?.close();
      this.videoElement.pause();
    }
  };
  /**播放 */
  play = (delayTimeStamp?: number) => {
    this.init(delayTimeStamp);
  };

  reload = () => {
    this.reloadFlg = true;
    this.init();
  };

  /**点击全部位置可暂停功能 */
  addEventListenerClickModel = (add = true) => {
    const { id } = this.state;
    const clickModel = $(`#clickModel${id}`);
    clickModel.off('mousedown contextmenu');
    $(document).off('click');

    if (add) {
      clickModel.on('contextmenu', (e) => {
        e.preventDefault();
      });
      clickModel.mousedown((e) => {
        e.stopPropagation();
        if (e.which === 1) {
          !this.state.showContextMenu && this.pause();
          this.state.showContextMenu && this.setState({ showContextMenu: false });
        } else if (e.which === 3) {
          const scrollTop = $(window).scrollTop() || 100;
          this.setState({ showContextMenu: true }, () => {
            $(`#newPlayerBox${id} .PlayerContextMenu`).css({
              left: e.pageX + 10,
              top: e.pageY - (scrollTop + 10),
            });
          });
        }
      });
      $(document).on('click', () => {
        this.state.showContextMenu && this.setState({ showContextMenu: false });
      });
    }
  };

  getPointCanvasDOM = (id?: string) => {
    if (this.pointCanvas || !id) return this.pointCanvas;
    this.pointCanvas = document.getElementById(id) as HTMLCanvasElement;
    return this.pointCanvas;
  };

  setPointCanvasDOMStyle = (width: number, height: number) => {
    const pointCanvasDOM = this.pointCanvas;
    pointCanvasDOM!.width = width;
    pointCanvasDOM!.height = height;
  };

  videoOnPlay = () => {
    const { videoType, id, mediaInfo } = this.state;
    const { onPlay } = this.props;
    const video = this.videoElement;
    const videoPattern = video.getAttribute('videoPattern') as VideoPattern;

    this.reloadFlg = false;
    if (videoType === 'hardwareDecoding') {
      video.removeEventListener('play', this.videoOnPlay);
      this.setPointCanvasDOMStyle(video.videoWidth, video.videoHeight);
      const ratio = this.computeTextElementFontSizeRatio();
      this.setTextElementFontSize(ratio);
      console.log(`${videoPattern}视频`, {
        width: video.videoWidth,
        height: video.videoHeight,
      });
      this.setState({
        mediaInfo: { width: video.videoWidth, height: video.videoHeight },
      });
      onPlay && onPlay(video.videoWidth, video.videoHeight, videoPattern, 'hardwareDecoding');
    } else {
      this.setPointCanvasDOMStyle(mediaInfo.width, mediaInfo.height);
      const ratio = this.computeTextElementFontSizeRatio();
      this.setTextElementFontSize(ratio);
      console.log('265视频', {
        width: mediaInfo.width,
        height: mediaInfo.height,
      });
      onPlay && onPlay(mediaInfo.width, mediaInfo.height, '265', 'softwareDecoding');
    }
  };

  calcCavasStyles = () => {
    setTimeout(() => {
      // 兼容一下机器全屏比较慢的情况
      const screenHeight = this.state.playerRef?.current?.getBoundingClientRect().height;
      // console.log(this.state.fullscreen, screenHeight, this.state.mediaInfo.height);
      screenHeight &&
        this.setState({
          canvasStyles: {
            width: 'auto',
            height: screenHeight < this.state.mediaInfo.height ? 'auto' : '100%',
          },
        });
    }, 1500);
  };

  /** 底部控制栏 */
  renderControls = () => {
    const { id, showControl, status } = this.state;
    const { extra, closeControlBar, banfullscreen } = this.props;
    return (
      <div
        className="playerControls"
        id={`playerControls${id}`}
        style={{
          opacity: showControl ? 1 : 0,
          bottom: closeControlBar ? '-35px' : showControl ? 0 : '-35px',
        }}
      >
        <div className="playback-control">
          {status === 'playing' ? (
            <div className="control-icon">
              <img src={pauseIcon} onClick={this.pause} />
            </div>
          ) : (
            <div className="control-icon">
              <img
                src={playIcon}
                onClick={() => {
                  this.play();
                }}
              />
            </div>
          )}
        </div>

        <div className="controlBox">
          {!banfullscreen && (
            <div className="full" onClick={this.full}>
              <img className="fullIcon" src={fullscreenIcon} />
            </div>
          )}
          {this.props.screenshot && this.state.videoType !== '' && (
            <div
              className="snapshot"
              onClick={() => {
                if (typeof this.props.screenshot === 'function') {
                  this.screenshot(this.props.screenshot);
                } else {
                  this.screenshot();
                }
              }}
            >
              <CameraOutlined className="snapshotIcon" />
            </div>
          )}
          {!!extra && <div className="extra">{extra instanceof Function ? extra() : extra}</div>}
        </div>
      </div>
    );
  };

  /** 截图 */
  screenshot = (
    callback?: (data: string | Blob | null) => void,
    fmt?: string,
    dataType?: TDataType,
    quality?: number,
  ) => {
    const { videoType, status, id } = this.state;

    if (status !== 'playing') {
      return;
    }

    const downLoad = (dataUrl: string) => {
      if (!callback) {
        var a = document.createElement('a'); // 创建一个a节点插入的document
        var event = new MouseEvent('click'); // 模拟鼠标click点击事件
        a.download = `视频截图${new Date().toLocaleString()}`; // 设置a节点的download属性值
        a.href = dataUrl; // 将图片的src赋值给a节点的href
        a.dispatchEvent(event); // 触发鼠标点击事件
      }
    };

    let dataUrl: any;
    if (videoType === 'softwareDecoding') {
      var canvas = document.getElementById(`canvas${id}`) as any;
      var gl = canvas.getContext('webgl2');
      if (dataType === 'blob') {
        canvas.toBlob(callback, fmt || 'image/jpeg', quality || 1);
      } else {
        dataUrl = gl.canvas.toDataURL(fmt || 'image/jpeg', quality || 1);
        callback && callback(dataUrl);
        // todo 是否需要前端渲染层
      }
      downLoad(dataUrl);
    }
    if (videoType === 'hardwareDecoding' || videoType === 'primordial') {
      const video = this.videoElement;
      const canvas = document.createElement('canvas');
      const canvasCtx = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvasCtx?.drawImage(video, 0, 0, canvas.width, canvas.height);

      const pointImg = this.pointCanvas?.toDataURL('image/png', quality || 1);
      var pointImage = new Image();
      pointImage.src = pointImg;
      pointImage.onload = function () {
        canvasCtx?.drawImage(pointImage, 0, 0, canvas.width, canvas.height);

        if (dataType === 'blob') {
          callback && canvas.toBlob(callback, fmt || 'image/jpeg', quality || 1);
        } else {
          dataUrl = canvas.toDataURL(fmt || 'image/jpeg', quality || 1); //转url
          callback && callback(dataUrl);
        }
        downLoad(dataUrl);
      };
    }
  };

  /** 定时更新当前时间 */
  intervalUpdateTime = () => {
    clearInterval(this.curentTimer);
    this.setState({
      currentTime: new Date().toString(),
    });
    this.curentTimer = setInterval(() => {
      this.setState({
        currentTime: new Date().toString(),
      });
    }, 1000);
  };

  /** 播放器信息 */
  renderVideoInfo = () => {
    const { showVideoInfoPanel, videoInfo } = this.state;
    return renderVideoInfoElement(
      videoInfo,
      showVideoInfoPanel,
      () => {
        this.setState({ showVideoInfoPanel: false });
      },
      Version,
    );
  };

  /** 右键点击菜单 */
  renderContentMenu = () => {
    const { showContextMenu } = this.state;
    const { url } = this.props;
    if (showContextMenu) {
      return renderContentMenuElement(url, () => {
        this.setState({ showVideoInfoPanel: true });
      });
    }
    return null;
  };

  /** render sei中的 videoTime */
  renderVideoTime() {
    return this.state.videoTime ? (
      <div className={`video-time ${this.props.videoTimeClass || ''}`}>
        <span>{moment(this.state.videoTime).format('LTS')}</span>
        <br />
        <span>{this.state.videoTime}</span>
      </div>
    ) : (
      ''
    );
  }

  componentWillUnmount() {
    const { id } = this.state;
    //@ts-ignore
    this.state.status = 'pause';
    console.log('停止');
    $(`#newPlayerBox${id}`).off('mouseover mouseout');
    $(`#playerControls${id}`).off('mouseover mouseout');
    this.resizeObserver?.disconnect();
    this.addEventListenerClickModel(false);
    this.timeHandler = undefined;
    this.urlChangeTime = undefined;
    this.state?.playerExample?.close();
  }

  render() {
    const { width, height, videoClass, canvasClass, showVideoNtp, emptyurlPrompt } = this.props;
    const {
      id,
      status,
      videoType,
      fullscreen,
      playerRef,
      fontSizeType,
      mediaInfo,
      errorMsg,
      canvasStyles,
    } = this.state;

    return (
      <div
        className="newPlayerBox"
        id={`newPlayerBox${id}`}
        style={{
          width: width ? width : '100%',
          height: height ? height : '100%',
        }}
        key={id}
        ref={playerRef}
      >
        <div className={`clickModel clickModel${id}`} id={`clickModel${id}`} />
        {this.renderVideoInfo()}
        {this.renderContentMenu()}
        <canvas
          className="pointCanvas"
          id={`point${id}`}
          width={1920}
          height={1080}
          style={fullscreen ? canvasStyles : {}}
        />
        <div className={`waterMarkClass ${fullscreen ? 'fullwaterMarkClass' : ''}`}>
          {this.renderControls()}
          {showVideoNtp && this.renderVideoTime()}
          <video
            muted
            loop
            playsInline
            autoPlay
            className={`${videoType === 'softwareDecoding' ? 'playerHide' : ''} ${
              videoClass || ''
            }`}
            id={`newPlayer${id}`}
            crossOrigin="anonymous"
          ></video>
          <canvas
            id={`canvas${id}`}
            className={`newPlayerCanvas ${canvasClass || ''} ${
              videoType === 'hardwareDecoding' ? 'playerHide' : ''
            }`}
            width={mediaInfo.width}
            height={mediaInfo.height}
            style={fullscreen ? canvasStyles : {}}
          ></canvas>
          {status === 'error' && (
            <div className={`errModel ${fontSizeType}`}>
              <div className="errInfo ">
                <div className="videoError defaultError"></div>
                <p className="videoTxt"> {errorMsg}</p>
              </div>
            </div>
          )}
          {status === 'urlerr' && (
            <div className={`errModel ${fontSizeType}`}>
              <div className="errInfo">
                <div className="videoError urlerr"></div>
                <p className="videoTxt">视频流地址错误</p>
              </div>
            </div>
          )}
          {status === 'emptyurl' && (
            <div className={`errModel ${fontSizeType}`}>
              <div className="errInfo">
                <div className="videoError emptyurl"></div>
                <p className="videoTxt">{emptyurlPrompt || ' '}</p>
              </div>
            </div>
          )}
          {status === 'loading' && (
            <div className={`errModel ${fontSizeType}`}>
              <div className="errInfo">
                <div className="videoError loading"></div>
                <p className="videoTxt">加载中</p>
              </div>
            </div>
          )}

          {status === 'reload' && (
            <div className={`errModel ${fontSizeType}`}>
              <div className="errInfo">
                <div className="videoError reload"></div>
                <p className="videoTxt reloadTxt">
                  摄像头连接失败，请尝试
                  <span onClick={this.reload} className="reload">
                    &nbsp;重新连接
                    <RedoOutlined />
                  </span>
                </p>
              </div>
            </div>
          )}

          {status === 'pause' && (
            <div
              className={`pauseModel ${fontSizeType}`}
              onClick={() => {
                this.play();
              }}
            >
              <p>
                <PlayCircleOutlined />
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }
}

PlayerCon.defaultProps = {
  autoPlay: true,
  showEffectFlow: true,
};
