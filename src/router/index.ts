/**
 * @fileoverview Vue Router config with history mode and lazy-loaded routes.
 * History mode uses the browser History API for clean URLs (`/shows/123`
 * instead of `/#/shows/123`) — prettier, easier to share, and SEO-friendly.
 * Requires the server to serve index.html for all routes (handled by the
 * dev proxy in tools/dev.ts and by Vercel's SPA rewrite in production).
 */

import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/shows/:id',
      name: 'show-detail',
      component: () => import('@/views/ShowDetailView.vue'),
      props: true,
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('@/views/SearchView.vue'),
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
