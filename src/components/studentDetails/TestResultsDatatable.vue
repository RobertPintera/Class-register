<script setup lang="ts">
import Card from '../core/Card.vue';

</script>

<template>
  <Card>
    <h3>Test Results - Data Table</h3>
    <DataTable>
      <Column field="testName" header="Test">
      </Column>
      <Column field="points" header="Score">
      </Column>
      <Column field="percentage" header="Normalized Score (%)">
      </Column>
      <Column field="maxPoints" header="Max Points">
      </Column>
      <Column field="status" header="Status">
      </Column>
    </DataTable>
  </Card>  
</template>