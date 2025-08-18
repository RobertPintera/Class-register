<script setup lang="ts">
import { ref } from 'vue';
import Card from '../core/Card.vue';
import EditPersonalDataDialog from './EditPersonalDataDialog.vue';
import type { Student } from '@/models/Student';

const props = defineProps<{studentId: string}>();
const showEditPersonalDataDialog = ref<boolean>(false);

</script>

<template>
  <Card>
    <template #header>
      <h3>Actions</h3>
    </template>
    <template #body>
      <div class="flex flex-col">
        <h4>Edit Personal Data</h4>
        <Button label="Edit" class="w-fit" @click="showEditPersonalDataDialog = true"/>
      </div>
      <EditPersonalDataDialog :studentId="studentId" v-model:visible="showEditPersonalDataDialog" />
    </template>
  </Card>
</template>