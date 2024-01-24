//@ts-nocheck
import copy from 'copy-to-clipboard';

import { CopyOutlined, InfoCircleOutlined } from '@ant-design/icons';
import React from 'react';
import { videoHeadInfo } from './PlayerInterface';

export function getChromeVersion() {
  const versionInfo = navigator.userAgent.split(' ');
  const chromeVersion = versionInfo.find((item) => {
    return item.includes('Chrome/') || item.includes('chrome/');
  });

  if (chromeVersion) {
    const version = chromeVersion.split('/')[1]?.split('.')[0];
    if (version) {
      return version;
    }
    return false;
  }

  return false;
}

export function videoCanPlay265() {
  const video = document.createElement('video');

  return (
    video.canPlayType('video/mp4;codecs="hev1.1.6.L120.90"') === 'probably' &&
    MediaSource.isTypeSupported('video/mp4;codecs="hev1.1.6.L120.90"')
  );
}

export const videInfoKey = ['radar_time:', 'video_time:', 'video_count:'];

export const fullElement = (playerBox: any) => {
  if (document.fullscreenElement === playerBox) {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  } else {
    playerBox.requestFullscreen();
  }
};

export const computedFontSizeFun = (width: number) => {
  if (width <= 500) {
    return 'small';
  } else if (width > 500 && width <= 800) {
    return 'default';
  } else if (width > 800 && width <= 1200) {
    return 'medium';
  } else {
    return 'large';
  }
};

export const setValidObjectTexts = (texts: any) => {
  if (Array.isArray(texts) === false) return [];
  return texts.map((text: any) => {
    if ('value' in text === false) {
      return { key: text.key, value: '-' };
    } else {
      if (videInfoKey.includes(text.key)) {
        return { key: text.key, value: text.key + text.value };
      }
    }
    return text;
  });
};

export const renderVideoInfoElement = (
  videoInfo: any,
  showVideoInfoPanel: any,
  closeVideoInfoPanel: any,
  Version: any,
) => {
  if (showVideoInfoPanel) {
    const infoKeys = Object.keys(videoInfo);
    return (
      <div className="videoInfoPanel">
        <div
          className="videoInfoPanelClose"
          onClick={() => {
            closeVideoInfoPanel();
          }}
        >
          [X]
        </div>
        <div>
          <div>Version:</div>
          <span>{Version}</span>
        </div>
        {infoKeys.map((key) => {
          return (
            <div key={key}>
              <div>{key}:</div>
              <span>{videoInfo[key]}</span>
            </div>
          );
        })}
      </div>
    );
  }

  return null;
};

export const renderContentMenuElement = (url: string, showVideoInfoPanel: any) => {
  return (
    <div className={`PlayerContextMenu`}>
      <div
        className="menuItem"
        onClick={() => {
          if (copy(url)) {
            // message.success('复制成功');
          }
        }}
      >
        <CopyOutlined />
        复制视频网址
      </div>
      <div
        className="menuItem"
        onClick={() => {
          showVideoInfoPanel();
        }}
      >
        <InfoCircleOutlined />
        详细统计信息
      </div>
    </div>
  );
};

export const handleVideoHeadInfo = (data: string) => {
  const canPlay265 = videoCanPlay265();
  const ChromeVersion = getChromeVersion();
  const videoHeadInfo: videoHeadInfo = {
    decodingPattern: 'hardwareDecoding',
    videoPattern: '264',
  };
  let videoHeader;
  try {
    videoHeader = JSON.parse(data);
  } catch (e) {
    videoHeader = data;
  }

  if (typeof videoHeader === 'object') {
    const data = videoHeader.data;
    if (!data) {
      // message.error('视频头信息有误!');
      return false;
    }

    videoHeadInfo.mimeType = data.mime_type;
    if (canPlay265) {
      if (!data.mime_type.includes('avc1')) {
        videoHeadInfo.videoPattern = '265';
      }
    } else {
      if (!data.mime_type.includes('avc1')) {
        videoHeadInfo.videoPattern = '265';
        videoHeadInfo.decodingPattern = 'softwareDecoding';
      }
    }
  } else {
    if (data === 'h265') {
      videoHeadInfo.decodingPattern = 'softwareDecoding';
      videoHeadInfo.videoPattern = '265';
    } else {
      videoHeadInfo.mimeType = 'video/mp4; codecs=avc1.' + data;
    }
  }

  console.log(
    { newHeadInfo: typeof videoHeader === 'object', canPlay265, ChromeVersion },
    videoHeadInfo,
  );
  return videoHeadInfo;
};

/**
 *  往url中添加版本信息
 */
export const formatWsUrl = (originUrl: string, version: string) => {
  try {
    const url = new URL(originUrl);
    url.searchParams.set('version', version);
    return url.href;
  } catch (e) {
    return originUrl;
  }
};
