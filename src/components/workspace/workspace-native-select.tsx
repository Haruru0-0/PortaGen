"use client";

import { cn } from "@/lib/utils";
import * as React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "./workspace-overlays";
import { WorkspaceControlFrame } from "./workspace-frame";

type OptionProps = { value?: string | number; label?: string; disabled?: boolean; selected?: boolean; children?: React.ReactNode };
type Choice = { value: string; label: string; disabled: boolean; selected: boolean; group?: string };
function readOptions(children: React.ReactNode, inheritedDisabled = false, group?: string): Choice[] {
  return React.Children.toArray(children).flatMap(child => {
    if (!React.isValidElement<OptionProps>(child)) return [];
    if (child.type === "optgroup" || child.type === React.Fragment) {
      return readOptions(child.props.children, inheritedDisabled || !!child.props.disabled, child.type === "optgroup" ? child.props.label : group);
    }
    if (child.type !== "option") return [];
    const text = React.Children.toArray(child.props.children).join("");
    return [{ value: String(child.props.value ?? text), label: child.props.label ?? text,
      disabled: inheritedDisabled || !!child.props.disabled, selected: !!child.props.selected, group }];
  });
}

/** Styled Radix options, backed by a native select for existing form/ref/onChange contracts. */
export const WorkspaceNativeSelect = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  function WorkspaceNativeSelect({ children, value, defaultValue, className, style, id, onChange, disabled, autoFocus, ...props }, forwardedRef) {
    const generatedId = React.useId();
    const triggerId = id ?? generatedId;
    const emptyValue = `${generatedId}-empty`;
    const choices = readOptions(children);
    const groups: { label?: string; options: Choice[] }[] = [];
    for (const option of choices) {
      if (!groups.length || groups[groups.length - 1].label !== option.group) groups.push({ label: option.group, options: [] });
      groups[groups.length - 1].options.push(option);
    }
    const initial = defaultValue ?? choices.find(option => option.selected)?.value ?? choices.find(option => !option.disabled)?.value ?? choices[0]?.value ?? "";
    const [selection, setSelection] = React.useState(String(initial));
    const selected = value === undefined ? selection : String(value);
    const native = React.useRef<HTMLSelectElement | null>(null);
    const trigger = React.useRef<HTMLButtonElement>(null);
    React.useEffect(() => {
      if (props.multiple) return;
      const form = native.current?.form;
      if (!form) return;
      const reset = (event: Event) => {
        queueMicrotask(() => {
          if (event.defaultPrevented || !native.current) return;
          const next = value === undefined ? String(initial) : String(value);
          if (value === undefined) setSelection(next);
          native.current.value = next;
        });
      };
      form.addEventListener("reset", reset);
      return () => form.removeEventListener("reset", reset);
    }, [value, initial, props.multiple]);
    // Reuse the original synthetic event's cancellation methods while exposing
    // the backing select as currentTarget to existing native-select handlers.
    const triggerEvents = Object.fromEntries(Object.entries(props)
      .filter(([name, handler]) => /^on[A-Z]/.test(name) && name !== "onInvalid" && typeof handler === "function")
      .map(([name, handler]) => [name, (event: React.SyntheticEvent<HTMLButtonElement>) => {
        if (!native.current) return;
        const adapted = new Proxy(event, { get(target, key) {
          if (key === "target" || key === "currentTarget") return native.current;
          const property = Reflect.get(target, key);
          return typeof property === "function" ? property.bind(target) : property;
        } });
        (handler as (event: React.SyntheticEvent) => void)(adapted);
      }])) as React.DOMAttributes<HTMLButtonElement>;
    const encode = (option: string) => option === "" ? emptyValue : option;
    const assignNative = (element: HTMLSelectElement | null) => {
      native.current = element;
      if (typeof forwardedRef === "function") forwardedRef(element);
      else if (forwardedRef) forwardedRef.current = element;
    };
    if (props.multiple) {
      return <WorkspaceControlFrame className={className} data-disabled={disabled || undefined}>
        <select {...props} ref={assignNative} id={id} className="ws-native-control" style={style} autoFocus={autoFocus} disabled={disabled}
          value={value} defaultValue={defaultValue} onChange={onChange}>{children}</select>
      </WorkspaceControlFrame>;
    }
    return <div className={cn("ws-native-select", className)} style={style}>
      <select {...props} ref={assignNative} className="ws-select-form-control" aria-hidden="true" tabIndex={-1}
        disabled={disabled} value={selected} onChange={onChange}
        onFocus={() => trigger.current?.focus()} onBlur={undefined}>{children}</select>
      <Select value={encode(selected)} disabled={disabled} required={props.required} onValueChange={next => {
        const nextValue = next === emptyValue ? "" : next;
        if (value === undefined) setSelection(nextValue);
        if (native.current) {
          native.current.value = nextValue;
          native.current.dispatchEvent(new Event("input", { bubbles: true }));
          native.current.dispatchEvent(new Event("change", { bubbles: true }));
        }
      }}>
        <SelectTrigger {...triggerEvents} ref={trigger} id={triggerId} className={className} autoFocus={autoFocus} tabIndex={props.tabIndex} title={props.title}
          aria-label={props["aria-label"]} aria-labelledby={props["aria-labelledby"]}
          aria-describedby={props["aria-describedby"]} aria-invalid={props["aria-invalid"]}>
          <SelectValue placeholder={choices.find(option => option.value === "")?.label ?? "Select an option"} />
        </SelectTrigger>
        <SelectContent>{groups.map((group, groupIndex) => <SelectGroup key={groupIndex}>
          {group.label && <SelectLabel>{group.label}</SelectLabel>}
          {group.options.map((option, index) => <SelectItem key={`${option.value}-${index}`}
            value={encode(option.value)} disabled={option.disabled}>{option.label}</SelectItem>)}
        </SelectGroup>)}</SelectContent>
      </Select>
    </div>;
  },
);
