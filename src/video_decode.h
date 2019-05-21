#pragma once

#include <stdint.h>

typedef struct ImageData{
    uint32_t width;
    uint32_t height;
    uint8_t *Ydata;
    uint8_t *Udata;
    uint8_t *Vdata;
} ImageData;

long video_decoder_init();
ImageData* video_decode_frame(long lHandle, const uint8_t *pPacketData, const uint32_t uiPacketDataLen);
void video_decoder_deinit(long lHandle);