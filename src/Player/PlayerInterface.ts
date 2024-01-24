import { ReactNode } from 'react';
export interface ICodeNameModel {
  code: [number, number, number];
  name: string;
}

export interface IPOS {
  x: number;
  y: number;
}

export type PartialICodeNameModel = Partial<ICodeNameModel>;

export interface WsPlayerProps {
  /** 当前视频是直播流或者视频片段 */
  ws?: boolean;
  /** 播放器宽度 默认占父元素 100% */
  width?: string;
  /** 播放器高度 默认占父元素 100% */
  height?: string;
  /** 视频地址 支持 (ws|http).mp4*/
  url: string;
  /** 是否显示截图按钮 可传入一个函数接收截图返回的 base64字符串 */
  screenshot?: boolean | ((data: string | Blob | null) => void);
  /** 是否展示效果流 */
  showEffectFlow?: boolean;
  /** 关闭底部控制栏 仅在直播流(ws=true)有效 */
  closeControlBar?: boolean;
  /** 禁止播放器全屏 仅在直播流(ws=true)有效  */
  banfullscreen?: boolean;
  /** 获取元素的 ref */
  onRef?: (ref: any) => void;
  /**视频流 Ptz信息change时回调 */
  onPtzChange?: (ptz: [number, number, number]) => void;
  videoClass?: string;
  canvasClass?: string;
  /** 控制台额外的标签 */
  extra?: ReactNode | (() => ReactNode);
  /** 播放错误或播放器错误时的回调 */
  onError?: () => void;
  /** 直播流开始播放的回调 */
  onPlay?: (
    videoWidth: number,
    videoHeight: number,
    videoType: VideoPattern,
    decodingPattern: DecodingPattern,
  ) => void;
  /** 在视频全屏切换时的回调 */
  onFullChange?: (full: boolean) => void;
  /** 是否开启断线重连 */
  reconnection?: boolean;
  /** 是否自动播放 */
  autoPlay?: boolean;
  videoTimeClass?: string;
  /** 展示视频流返回的 ntp时间 */
  showVideoNtp?: boolean;
  /** 当播放url为空字符串时展示的文字 */
  emptyurlPrompt?: string;
  /** 当前时间 会被用作基准时间 来进行视频延迟播放*/
  delayTimeStamp?: number;
}

export type DecodingPattern = 'hardwareDecoding' | 'softwareDecoding' | 'primordial';
export type VideoPattern = '264' | '265';
export type moveButton = 'left' | 'right' | 'top' | 'bottom';
export type EventType = 'add' | 'remove';
export type VideoType = 'hardwareDecoding' | 'softwareDecoding' | 'primordial' | '';
export type TDataType = 'dataUrl' | 'blob';

export interface videoHeadInfo {
  decodingPattern: DecodingPattern;
  videoPattern: VideoPattern;
  mimeType?: string;
}

export interface WsPlayerState {
  id?: string;
  playerExample?: {
    open: () => void;
    close: () => void;
  };
  showControl?: boolean;
  controlSwich?: boolean;
  warn?: moveButton | null;
  status?: 'normal' | 'error' | 'urlerr' | 'pause' | 'playing' | 'loading' | 'emptyurl' | 'reload';
  videoType?: VideoType;
  fullscreen: boolean;
  playerRef: any;
  fontSizeType: 'default' | 'small' | 'large' | 'medium';
  mediaInfo: { width: number; height: number };
  currentPTZInfo?: [number, number, number] | undefined;
  errorMsg: string;
  showContextMenu: boolean;
  showVideoInfoPanel: boolean;
  videoInfo: any;
  currentTime: string;
  videoTime: number;
  canvasStyles: React.CSSProperties;
}
