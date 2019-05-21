#include "video_decoder_context.h"

VideoDecoderContext *video_decoder_alloc_context() {
    VideoDecoderContext *pCtx = malloc(sizeof(VideoDecoderContext));
    if(NULL == pCtx) {
        video_decoder_free_context(pCtx);
        fprintf(stderr, "[wasm] Error: malloc VideoDecoderContext failed!\n");
        
        return NULL;
    }
    memset(pCtx, 0, sizeof(VideoDecoderContext));

    pCtx->pPacket = av_packet_alloc();
    if(NULL == pCtx->pPacket) {
        video_decoder_free_context(pCtx);
        fprintf(stderr, "[wasm] Error: malloc VideoDecoderContext failed!\n");
        return NULL;
    }
    av_init_packet(pCtx->pPacket);

    pCtx->pFrame = av_frame_alloc();
    if(NULL == pCtx->pFrame) {
        video_decoder_free_context(pCtx);
        fprintf(stderr, "[wasm] Error av_frame_alloc pFrame is NULL\n");
        return NULL;
    }

    pCtx->pImageData = malloc(sizeof(ImageData));
    if(NULL == pCtx->pImageData) {
        video_decoder_free_context(pCtx);
        fprintf(stderr, "[wasm] Error: malloc pCtx->pImageData failed!\n");
        return NULL;
    }
    memset(pCtx->pImageData, 0, sizeof(ImageData));

    return pCtx;
}

void video_decoder_free_context(VideoDecoderContext *pCtx) {
    if(NULL == pCtx) {
        return ;
    }

    if(NULL != pCtx->pImageData) {
        free(pCtx->pImageData);
        pCtx->pImageData = NULL;
    }

    if(NULL != pCtx->pFrame) {
        av_frame_free(&pCtx->pFrame);
        pCtx->pFrame = NULL;
    }

    if(NULL != pCtx->pPacket) {
        av_packet_free(&pCtx->pPacket);
        pCtx->pPacket = NULL;
    }

    if(NULL != pCtx) {
        free(pCtx);
        pCtx = NULL;
    }
}