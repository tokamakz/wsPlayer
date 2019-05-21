#pragma once

#include "video_decode.h"

#include "libavutil/avutil.h"
#include "libavcodec/avcodec.h"

typedef struct VideoDecoderContext {
    AVCodecContext *pCodecCtx;
    AVPacket       *pPacket;
    AVFrame        *pFrame;
    ImageData      *pImageData;
} VideoDecoderContext;

VideoDecoderContext *video_decoder_alloc_context();
void video_decoder_free_context(VideoDecoderContext *pCtx);