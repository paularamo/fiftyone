import { PluginComponentType, registerComponent } from "@fiftyone/plugins";
import { defineCustomPanel } from "../CustomPanel";
import OperatorIcon from "../OperatorIcon";
import { ExecutionContext } from "../operators";

export default function registerPanel(ctx: ExecutionContext) {
  registerComponent({
    type: PluginComponentType.Panel,
    name: ctx.params.panel_name,
    component: defineCustomPanel(ctx.params),
    label: ctx.params.panel_label,
    activator: () => true,
    Icon: () => {
      return (
        <OperatorIcon
          icon={ctx.params.icon || "extension"}
          darkIcon={ctx.params.dark_icon}
          lightIcon={ctx.params.light_icon}
          iconProps={{ sx: { fontSize: 14, mr: "0.5rem" } }}
          _builtIn={ctx.params._builtin}
          canExecute={true}
        />
      );
    },
    panelOptions: {
      allowDuplicates: ctx.params.allow_duplicates,
      helpMarkdown: ctx.params.help_markdown,
      surfaces: ctx.params.surfaces,
      alpha: ctx.params.alpha,
      beta: ctx.params.beta,
      category: ctx.params.category,
      isNew: ctx.params.is_new,
      priority: ctx.params.priority,
    },
  });
}
