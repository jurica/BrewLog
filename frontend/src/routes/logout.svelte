<script lang="ts">
  import { logout } from "$lib/api";
  import { navigate } from "sv-router/generated";

  logout();
  navigate("/");
</script>
