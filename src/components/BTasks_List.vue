<script setup>
// Copyright (C) 2023 Maxim [maxirmx] Samsonov (www.sw.consulting)
// All rights reserved.
// This file is a part of O!Service applcation
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions
// are met:
// 1. Redistributions of source code must retain the above copyright
// notice, this list of conditions and the following disclaimer.
// 2. Redistributions in binary form must reproduce the above copyright
// notice, this list of conditions and the following disclaimer in the
// documentation and/or other materials provided with the distribution.
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

import { VDataTable } from 'vuetify/lib/labs/components.mjs'
import router from '@/router'
import { storeToRefs } from 'pinia'
import { strategies } from '@/helpers/strategies.js'
import { itemsPerPageOptions } from '@/helpers/items.per.page.js'
import { mdiMagnify } from '@mdi/js'

import { useConfirm } from 'vuetify-use-dialog'
const confirm = useConfirm()

import { useBTasksStore } from '@/stores/btasks.store.js'
import { useAuthStore } from '@/stores/auth.store.js'
import { useAlertStore } from '@/stores/alert.store.js'

const authStore = useAuthStore()

const btasksStore = useBTasksStore()
const { btasks } = storeToRefs(btasksStore)
btasksStore.getAll(false)

const alertStore = useAlertStore()
const { alert } = storeToRefs(alertStore)

function getState(item) {
  let crd = !item?.isRunning ? 'Остановлена' : 'Запущена'
  if (item?.hasFailed) crd += ' [Ошибка]'
  return crd
}

function editBTask(item) {
  router.push('btask/edit/' + item.id)
}

function startBTask(item) {
  item.isStartStop = true
  btasksStore
    .start(item['id'])
    .then(() => {
      btasksStore.getAll()
    })
    .catch((error) => {
      alertStore.error(error)
    })
    .finally(() => (item.isStartStop = false))
}

function stopBTask(item) {
  item.isStartStop = true
  btasksStore
    .stop(item['id'])
    .then(() => {
      btasksStore.getAll()
    })
    .catch((error) => {
      alertStore.error(error)
    })
    .finally(() => (item.isStartStop = false))
}

async function deleteBTask(item) {
  const content =
    'Удалить торгового робота "' + item.strategy + ' ' + item.symbol1 + '/' + item.symbol2 + '" ?'
  const result = await confirm({
    title: 'Подтверждение',
    confirmationText: 'Удалить',
    cancellationText: 'Не удалять',
    dialogProps: {
      width: '30%',
      minWidth: '250px'
    },
    confirmationButtonProps: {
      color: 'orange-darken-3'
    },
    content: content
  })

  if (result) {
    btasksStore
      .delete(item['id'])
      .then(() => {
        btasksStore.getAll()
      })
      .catch((error) => {
        alertStore.error(error)
      })
  }
}
function filterBTasks(value, query, item) {
  if (query == null || item == null) {
    return false
  }
  const i = item.raw
  if (i == null) {
    return false
  }
  const q = query.toLocaleUpperCase()

  if (
    i.strategy.toLocaleUpperCase().indexOf(q) !== -1 ||
    i.symbol1.toLocaleUpperCase().indexOf(q) !== -1 ||
    i.symbol2.toLocaleUpperCase().indexOf(q) !== -1 ||
    i.threshold.toLocaleUpperCase().indexOf(q) !== -1
  ) {
    return true
  }

  const crd = getState(i)
  if (crd.toLocaleUpperCase().indexOf(q) !== -1) {
    return true
  }

  return false
}

const headers = [
  { title: '', align: 'center', key: 'icon' },
  { title: 'Стратегия', align: 'start', key: 'strategy' },
  { title: 'Базовая криптовалюта', align: 'center', key: 'symbol1' },
  { title: 'Криптовалюта котировки', align: 'center', key: 'symbol2' },
  { title: 'Порог', align: 'center', key: 'threshold' },
  { title: 'Состояние', align: 'center', key: 'isRunning' },
  { title: '', align: 'center', key: 'actionStartStop', sortable: false, width: '5%' },
  { title: '', align: 'center', key: 'actionEdit', sortable: false, width: '5%' },
  { title: '', align: 'center', key: 'actionDelete', sortable: false, width: '5%' }
]
</script>

<template>
  <div class="settings table-2">
    <h1 class="orange">Торговые роботы</h1>
    <hr class="hr" />

    <div class="link-crt">
      <router-link :to="'/btask/add'" class="link">
        <font-awesome-icon
          size="1x"
          icon="fa-solid fa-plus"
          class="link"
        />&nbsp;&nbsp;&nbsp;Создать торгового робота
      </router-link>
    </div>

    <v-card>
      <v-data-table
        v-if="btasks?.length"
        v-model:items-per-page="authStore.btasks_per_page"
        items-per-page-text="Торговых роботов на странице"
        :items-per-page-options="itemsPerPageOptions"
        page-text="{0}-{1} из {2}"
        v-model:page="authStore.btasks_page"
        :headers="headers"
        :items="btasks"
        :search="authStore.btasks_search"
        :custom-filter="filterBTasks"
        v-model:sort-by="authStore.btasks_sort_by"
        item-value="number"
        class="elevation-1"
        pa-0
      >
        <template v-slot:[`item.icon`]="{ item }">
          <component :is="strategies.getIconByName(item.strategy, !item.isRunning)"></component>
        </template>

        <template v-slot:[`item.isRunning`]="{ item }">
          {{ getState(item) }}
        </template>

        <template v-slot:[`item.actionStartStop`]="{ item }">
          <div v-if="item.isStartStop">
            <span class="spinner-border spinner-border-sm align-center"></span>
          </div>
          <button
            v-if="!item.isStartStop && item.isRunning"
            @click="stopBTask(item)"
            class="anti-btn"
          >
            <font-awesome-icon size="1x" icon="fa-solid fa-hand" class="anti-btn" />
          </button>
          <button
            v-if="!item.isStartStop && !item.isRunning"
            @click="startBTask(item)"
            class="anti-btn"
          >
            <font-awesome-icon size="1x" icon="fa-solid fa-play" class="anti-btn" />
          </button>
        </template>

        <template v-slot:[`item.actionEdit`]="{ item }">
          <button @click="editBTask(item)" class="anti-btn">
            <font-awesome-icon size="1x" icon="fa-solid fa-pen" class="anti-btn" />
          </button>
        </template>

        <template v-slot:[`item.actionDelete`]="{ item }">
          <button @click="deleteBTask(item)" class="anti-btn">
            <font-awesome-icon size="1x" icon="fa-solid fa-trash-can" class="anti-btn" />
          </button>
        </template>
      </v-data-table>
      <v-spacer></v-spacer>
      <div v-if="!btasks?.length" class="text-center m-5">Список торговых роботов пуст пуст</div>
      <v-text-field
        v-if="btasks?.length"
        v-model="authStore.btasks_search"
        :append-inner-icon="mdiMagnify"
        label="Поиск по любой информации о торговом роботе"
        variant="solo"
        hide-details
      />
    </v-card>
    <div v-if="btasks?.loading" class="text-center m-5">
      <span class="spinner-border spinner-border-lg align-center"></span>
    </div>
    <div v-if="btasks?.error" class="text-center m-5">
      <div class="text-danger">Ошибка при загрузке списка торговых роботов: {{ btasks.error }}</div>
    </div>
    <div v-if="alert" class="alert alert-dismissable mt-3 mb-0" :class="alert.type">
      <button @click="alertStore.clear()" class="btn btn-link close">×</button>
      {{ alert.message }}
    </div>
  </div>
</template>
