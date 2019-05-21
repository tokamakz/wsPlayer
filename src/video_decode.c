#include "video_decode.h"

#include <stdio.h>

#include "video_decoder_context.h"

long video_decoder_init() { 
    VideoDecoderContext *pCtx = video_decoder_alloc_context();
    if(NULL == pCtx) {
        fprintf(stderr, "[wasm] Error: video_decoder_alloc_context failed!\n");
        return -1;
    }

    enum AVCodecID codeid = AV_CODEC_ID_H264;

    AVCodec *pCodec = avcodec_find_decoder(codeid);
    if (!pCodec) {
        fprintf(stderr, "[wasm] Error avcodec_find_decoder\n");
        return -1;
    }

    pCtx->pCodecCtx = avcodec_alloc_context3(pCodec);
    if (!pCtx->pCodecCtx) {
        fprintf(stderr, "[wasm] Error avcodec_alloc_context3\n");
        return -1;
    }

    int ret = avcodec_open2(pCtx->pCodecCtx, pCodec, NULL);
    if (ret < 0) {
        fprintf(stderr, "[wasm] Error avcodec_open2 (%s)\n", av_err2str(ret));
        return -1;
    }

    return (long)pCtx;
}

ImageData* video_decode_frame(long lHandle, const uint8_t *pPacketData, const uint32_t uiPacketDataLen)
{
    if (lHandle <= 0 || NULL == pPacketData || 0 == uiPacketDataLen) {
        fprintf(stderr, "[wasm] Error: video_decode_frame parameter error!\n");
        return NULL;
    }

    VideoDecoderContext *pCtx = (VideoDecoderContext *)lHandle;

    pCtx->pPacket->data = pPacketData;
    pCtx->pPacket->size = uiPacketDataLen;

    int got_picture = 0;
    int ret = avcodec_decode_video2(pCtx->pCodecCtx, pCtx->pFrame, &got_picture, pCtx->pPacket);
    if (ret < 0) {
        fprintf(stderr, "[wasm] Error decoding video frame (%s)\n", av_err2str(ret));
        return NULL;
    }

    if (got_picture) {   
        pCtx->pImageData->width  = (uint32_t)pCtx->pCodecCtx->width;
        pCtx->pImageData->height = (uint32_t)pCtx->pCodecCtx->height;
        pCtx->pImageData->Ydata  = pCtx->pFrame->data[0];
        pCtx->pImageData->Udata  = pCtx->pFrame->data[1];
        pCtx->pImageData->Vdata  = pCtx->pFrame->data[2];
        return pCtx->pImageData;
    }

    return NULL;
}

void video_decoder_deinit(long lHandle) { 
    if (lHandle <= 0) {
        return ;
    }

    VideoDecoderContext *pCtx = (VideoDecoderContext *)lHandle;
    if(pCtx != NULL) {
        avcodec_free_context(pCtx->pCodecCtx);
        video_decoder_free_context(pCtx);
    }
}