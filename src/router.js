import { createRouter, createWebHistory } from "vue-router";
import LoanList from "@/views/LoanList.vue";
import LoanDetail from '@/views/LoanDetail.vue';


const routes = [
  {
    path: '/',
    name: 'LoanList',
    component: LoanList,
    meta: {
      title: 'Loan List'
    }
  },
  {
    path: '/loan/:id',
    name: 'LoanDetail',
    component: LoanDetail,
    props: true
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  next();
});

export default router;
