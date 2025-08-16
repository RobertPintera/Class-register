<template>
  <header class="fixed w-full h-16 flex items-center border-b-2 border-primary-border p-4 pl-6 shadow-md bg-topbar-background z-10 gap-4">
    <div @click="$emit('toggle-sidebar')" class="hover:bg-gray-200 active:bg-gray-300 p-2 rounded-4xl">
       <span class="pi pi-bars"/>
    </div>
    <h3>Class Register</h3>
  </header>
</template>