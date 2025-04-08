<script setup lang="ts">
import { Toaster } from '@/components/ui/sonner'
</script>

<template>
  <Notivue v-slot="item">
    <Notification :item="item">
      <NotificationProgress :item="item" />
    </Notification>
  </Notivue>
  <ClientOnly>
    <Toaster position="top-right" />
  </ClientOnly>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
