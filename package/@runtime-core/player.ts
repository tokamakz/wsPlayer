import type { HtmlAttributes } from 'csstype'
import { isEmptyStr } from './helper'
import * as MP4Box from './mp4box.all.min.js'
interface Player {
  videoId: string | HtmlAttributes
  url: string | undefined | null
  ws: null | WebSocket
  // TODO: ADD QUEUE CONSTRUCTOR
  frameQueue: Array<any>
  sourcebuffer: SourceBuffer | null
  debug: boolean
  firstMessage: boolean
  open: () => void
}

export class WsPlayer implements Player {
  videoId: string
  url: string | null | undefined
  ws: WebSocket
  frameQueue: any[] = []
  firstMessage = true
  sourcebuffer: SourceBuffer | null
  debug: boolean

  constructor(videoId: string | HtmlAttributes, url: string | null | undefined, debug = false) {
    this.videoId = videoId
    this.url = url
    this.frameQueue = []
    this.sourcebuffer = null
    this.debug = debug
    this.open()
    console.log('wsPlayer v1.0.1 20220626')
  }

  open() {
    if (!isEmptyStr(this.url)) {
      this.ws = new WebSocket(this.url!)
    }
    else {
      console.warn(`The ${this.url} can't be empty`)
      return false
    }
    this.ws.binaryType = 'arraybuffer'
  }

  source(info: any) {
    const codecs: Array<string> = []
    for (let i = 0; i < info.tracks.length; i++)
      codecs.push(info.tracks[i].codec)

    console.log(codecs)
    const video: HTMLVideoElement | null = document.getElementById(this.videoId) as HTMLVideoElement | null
    const mediasource: MediaSource = new MediaSource()
    if (video) {
      video.src = URL.createObjectURL(mediasource)
      let pre_pos = 0
      let { sourcebuffer } = this
      mediasource.onsourceopen = () => {
        sourcebuffer = mediasource.addSourceBuffer(`video/mp4; codecs="${codecs.join(', ')}"`) as SourceBuffer
        sourcebuffer.onupdateend = () => {
          const pos = video!.currentTime
          if (video && video.buffered.length > 0) {
            const start = video.buffered.start(video.buffered.length - 1)
            const end = video.buffered.end(video.buffered.length - 1)
            this.consale('info', `pos=${pos},start=${start},end=${end}`)
            if (pos < start) {
              this.consale('info', `set video.currentTime pos=${pos},start=${start},end=${end}`)
              video.currentTime = start
            }

            if (pos > end) {
              this.consale('info', `chase frame pos=${pos},start=${start},end=${end}`)
              video.currentTime = start
            }

            if (pos - pre_pos != 0 && end - pos > 3) {
              this.consale('info', `set end video.currentTime pos=${pos},start=${start},end=${end}`)
              video.currentTime = end
            }

            for (let i = 0; i < video.buffered.length - 1; i++) {
              const prestart = video.buffered.start(i)
              const preend = video.buffered.end(i)
              if (sourcebuffer && !sourcebuffer.updating)
                sourcebuffer.remove(prestart, preend)
            }

            if (sourcebuffer && pos - start > 10 && !sourcebuffer.updating) {
              this.consale('info', `remove start pos=${pos},start=${start},end=${end}`)
              sourcebuffer.remove(0, pos - 3)
            }

            if (sourcebuffer && end - pos > 10 && !sourcebuffer.updating) {
              this.consale('info', `remove end pos=${pos},start=${start},end=${end}`)
              sourcebuffer.remove(0, end - 3)
            }
            if (!sourcebuffer)
              this.consale('warn', '==>:Current sourcebuffer is null')
          }
          pre_pos = pos
        }
      }
    }
    else {
      console.warn(`The video element ${this.videoId} can't be empty`)
      return false
    }
  }

  onMessage() {
    this.ws.onmessage = (e) => {
      // TODO: 是否使用MP4box播放
      if (this.firstMessage) {
        this.firstMessage = false
        const messageEv = e.data
        const mp4Box = new MP4Box
        mp4Box.onReady = this.source
        messageEv.fileStart = 0
        mp4Box.appendBuffer(messageEv)
      }
      this.frameQueue.push(e.data)/*  */
      if (!this.sourcebuffer || this.sourcebuffer.updating)
        return

      if (this.frameQueue.length === 1) {
        this.sourcebuffer.appendBuffer(this.frameQueue.shift())
      }
      else {
        let byte_length = 0
        for (const qnode of this.frameQueue)
          byte_length += qnode.byteLength

        const mp4buf = new Uint8Array(byte_length)
        let offset = 0
        for (const qnode of this.frameQueue) {
          const frame = new Uint8Array(qnode)
          mp4buf.set(frame, offset)
          offset += qnode.byteLength
        }
        this.sourcebuffer.appendBuffer(mp4buf)
        this.frameQueue.splice(0, this.frameQueue.length)
      }
    }
  }

  close() {
    this.ws && this.ws.close()
  }

  // TODO: 获取剩余参数
  consale(level: 'info' | 'debug' | 'warn' | 'error' = 'info', ...info) {
    if (this.debug) {
      console[level](info)
    }
    else {

    }
  }
}
