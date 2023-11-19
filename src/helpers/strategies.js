// Copyright (C) 2023 Maxim [maxirmx] Samsonov  (www.sw.consulting)
// All rights reserved.
// This file is a part of O!Service applcation
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions
// are met:
// 1. Redistributions of source code must retain the above copyright
//    notice, this list of conditions and the following disclaimer.
// 2. Redistributions in binary form must reproduce the above copyright
//    notice, this list of conditions and the following disclaimer in the
//    documentation and/or other materials provided with the distribution.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
// ``AS IS'' AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED
// TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
// PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDERS OR CONTRIBUTORS
// BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.

import { reactive, markRaw } from 'vue'

import StopLossIcon from '@/components/icons/IconStopLoss.vue'
import StopLossIdleIcon from '@/components/icons/IconStopLossIdle.vue'
import TakeProfitIcon from '@/components/icons/IconTakeProfit.vue'
import TakeProfitIdleIcon from '@/components/icons/IconTakeProfitIdle.vue'

import UnknownIcon from '@/components/icons/IconUnknown.vue'

export const stcodes = {
  STOP_LOSS: 0,
  TAKE_PROFIT: 1
}

export const strategies = reactive({
  items: [
    {
      id: stcodes.STOP_LOSS,
      name: 'stop-loss',
      icon: markRaw(StopLossIcon),
      iconIdle: markRaw(StopLossIdleIcon)
    },
    {
      id: stcodes.TAKE_PROFIT,
      name: 'take-profit',
      icon: markRaw(TakeProfitIcon),
      iconIdle: markRaw(TakeProfitIdleIcon)
    }
  ],

  getName(code) {
    const item = this.items.find((obj) => {
      return obj.id === code
    })
    return item ? item.name : 'неизвестная стратегия'
  },
  getIcon(code, idle = false) {
    const item = this.items.find((obj) => {
      return obj.id === code
    })
    return item ? (idle ? item.iconIdle : item.icon) : markRaw(UnknownIcon)
  },
  getIconByName(name, idle = false) {
    const item = this.items.find((obj) => {
      return obj.name === name
    })
    return item ? (idle ? item.iconIdle : item.icon) : markRaw(UnknownIcon)
  }
})
