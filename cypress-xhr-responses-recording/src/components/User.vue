<template>
  <li>
    {{ user.name }} ({{ user.username }})
  </li>
</template>

<script>
export default {
  name: 'User',
  props: {
    user: {
      type: Object,
      required: true
    }
  },
}
</script>
