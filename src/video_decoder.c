#include <stdio.h>

#include "libavutil/avutil.h"
#include "libavcodec/avcodec.h"

typedef struct ImageData{
    int width;
    int height;
    uint8_t *Ydata;
    uint8_t *Udata;
    uint8_t *Vdata;
} ImageData;

static AVPacket *pAVPacket = NULL;
static AVFrame *pAVFrame = NULL;
ImageData *pImageData = NULL;
static AVCodecContext *pAVCodecContext= NULL;

int video_decoder_init(const int video_codeid) {
    if(video_codeid < 0) {
        fprintf(stderr, "[wasm] Error video_codeid < 0!\n");
        return -1;
    }

    pAVPacket = av_packet_alloc();
    if(NULL == pAVPacket) {
        fprintf(stderr, "[wasm] Error av_packet_alloc failed!\n");
        goto Failed;
    }
    av_init_packet(pAVPacket);

    pAVFrame = av_frame_alloc();
    if(NULL == pAVFrame) {
        fprintf(stderr, "[wasm] Error av_frame_alloc failed!\n");
        goto Failed;
    }

    pImageData = av_mallocz(sizeof(ImageData));
    if(NULL == pImageData) {
        fprintf(stderr, "[wasm] Error malloc ImageData failed!\n");
        goto Failed;
    }

    AVCodec *pAVCodec = avcodec_find_decoder(AV_CODEC_ID_H264);
    if (NULL == pAVCodec) {
        fprintf(stderr, "[wasm] Error avcodec_find_decoder failed!\n");
        goto Failed;
    }

    pAVCodecContext = avcodec_alloc_context3(pAVCodec);
    if (NULL == pAVCodecContext) {
        fprintf(stderr, "[wasm] Error avcodec_alloc_context3 failed!\n");
        goto Failed;
    }

    int ret = avcodec_open2(pAVCodecContext, pAVCodec, NULL);
    if (ret < 0) {
        fprintf(stderr, "[wasm] Error avcodec_open2 failed! (%s)\n", av_err2str(ret));
        goto Failed;
    }

    return 0;

Failed:
    avcodec_free_context(&pAVCodecContext);
    av_freep(&pImageData);
    av_frame_free(&pAVFrame);
    av_packet_free(&pAVPacket);
    return -1;
}

ImageData* video_decode_frame(uint8_t *packet_data, const int packet_size) {
    if (NULL == packet_data || 0 == packet_size) {
        fprintf(stderr, "[wasm] Error: video_decode_frame parameter error!\n");
        return NULL;
    }

    pAVPacket->data = packet_data;
    pAVPacket->size = packet_size;

    int ret = avcodec_send_packet(pAVCodecContext, pAVPacket);
    if (ret < 0) {
        fprintf(stderr, "[wasm] avcodec_send_packet failed!\n");
        return NULL;
    }

    ret = avcodec_receive_frame(pAVCodecContext, pAVFrame);
    if (ret == AVERROR(EAGAIN) || ret == AVERROR_EOF) {
        return NULL;
    } else if(ret < 0) {
        fprintf(stderr, "[wasm] avcodec_receive_frame failed!\n");
        return NULL;
    }

    pImageData->width  = pAVFrame->width;
    pImageData->height = pAVFrame->height;
    pImageData->Ydata  = pAVFrame->data[0];
    pImageData->Udata  = pAVFrame->data[1];
    pImageData->Vdata  = pAVFrame->data[2];
    return pImageData;
}
