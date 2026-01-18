<script lang="ts">
  import * as Api from "$lib/api";
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
  import { Input } from "$lib/components/ui/input/index";
  import {
    FieldGroup,
    Field,
    FieldLabel,
    FieldDescription
  } from "$lib/components/ui/field/index.js";
  import { navigate } from "sv-router/generated";
  const id = $props.id();
  let email: string = $state();
  let password: string = $state();

  async function login() {
    await Api.login(email, password);
    if (Api.isAuthenticated()) {
      navigate("/");
    }
  }

  if (Api.isAuthenticated()) {
    navigate("/");
  }
</script>

<Card.Root class="mx-auto w-full max-w-sm">
  <Card.Header>
    <Card.Title class="text-2xl">Login</Card.Title>
    <Card.Description
      >Enter your email below to login to your account</Card.Description
    >
  </Card.Header>
  <Card.Content>
    <form>
      <FieldGroup>
        <Field>
          <FieldLabel for="email-{id}">Email</FieldLabel>
          <Input
            id="email-{id}"
            type="email"
            placeholder="m@example.com"
            required
            bind:value={email}
          />
        </Field>
        <Field>
          <div class="flex items-center">
            <FieldLabel for="password-{id}">Password</FieldLabel>
            <a href="##" class="ms-auto inline-block text-sm underline">
              Forgot your password?
            </a>
          </div>
          <Input
            id="password-{id}"
            type="password"
            required
            bind:value={password}
          />
        </Field>
        <Field>
          <Button class="w-full" onclick={login}>Login</Button>
          <FieldDescription class="text-center">
            Don't have an account? <a href="##">Sign up</a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  </Card.Content>
</Card.Root>
