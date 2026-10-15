import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import './assets/main.css';
import { LocalStorageTaskRepository } from '@/data/LocalStorageTaskRepository';
import { seedIfEmpty } from '@/data/seed';
import { useTaskStore } from '@/stores/taskStore';
import { useToast } from '@/composables/useToast';

const app = createApp(App);
app.use(createPinia());

const repository = new LocalStorageTaskRepository();
seedIfEmpty(repository);

const taskStore = useTaskStore();
taskStore.init(repository);

if (!repository.isAvailable()) {
  useToast().pushToast(
    'Não foi possível acessar o armazenamento local. Os dados não serão salvos.',
    'error',
  );
}

app.mount('#app');
