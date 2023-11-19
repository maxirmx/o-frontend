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

import { defineStore } from 'pinia'
import { fetchWrapper } from '@/helpers/fetch.wrapper.js'
import { apiUrl } from '@/helpers/config.js'

const baseUrl = `${apiUrl}/btasks`

function translate(param) {
  param.isRunning = param.isRunning === 'RUNNING'
  return param
}

export const useBTasksStore = defineStore({
  id: 'btasks',
  state: () => ({
    btasks: {},
    btask: {}
  }),
  actions: {
    async add(btask, trnslt = false) {
      if (trnslt) {
        btask = translate(btask)
      }
      await fetchWrapper.post(`${baseUrl}/add`, btask)
    },
    async getAll() {
      this.btasks = { loading: true }
      try {
        const url = baseUrl
        this.btasks = await fetchWrapper.get(url)
      } catch (error) {
        this.btasks = { error }
      }
    },
    async get(id, trnslt = false) {
      this.btask = { loading: true }
      try {
        this.btask = await fetchWrapper.get(`${baseUrl}/${id}`)
        if (trnslt) {
          this.btask.isRunning = this.btask.isRunning ? 'RUNNING' : 'JERK'
        }
      } catch (error) {
        this.btask = { error }
      }
    },
    async delete(id) {
      try {
        await fetchWrapper.delete(`${baseUrl}/${id}`, {})
      } catch (error) {
        this.btask = { error }
      }
    },
    async start(id) {
      try {
        await fetchWrapper.post(`${baseUrl}/start/${id}`, {})
      } catch (error) {
        this.btask = { error }
      }
    },
    async stop(id) {
      try {
        await fetchWrapper.post(`${baseUrl}/stop/${id}`, {})
      } catch (error) {
        this.btask = { error }
      }
    },
    async update(id, params, trnslt = false) {
      if (trnslt) {
        params = translate(params)
      }
      await fetchWrapper.put(`${baseUrl}/${id}`, params)
    }
  }
})
