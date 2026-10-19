import type { Framework } from "./tokens";

/** "Acme" and "acme" are placeholders swapped for the visitor's product name at runtime. */
export const BUTTON_SNIPPET: Record<Framework, { file: string; lang: string; code: string }> = {
  react: {
    file: "SignUp.tsx",
    lang: "tsx",
    code: `import { Button } from "@acme/ui";

<Button variant="primary">Create account</Button>`,
  },
  vue: {
    file: "SignUp.vue",
    lang: "vue",
    code: `<script setup lang="ts">
import { Button } from "@acme/ui-vue";
</script>

<Button variant="primary">Create account</Button>`,
  },
  angular: {
    file: "sign-up.component.ts",
    lang: "angular-ts",
    code: `import { SfButton } from "@acme/ui-angular";

<sf-button variant="primary">Create account</sf-button>`,
  },
};

export type Highlighted = Record<Framework, string>;
