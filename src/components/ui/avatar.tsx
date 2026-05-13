import { Image as ImagePrimitive } from "@kobalte/core/image";
import type { ComponentProps, ValidComponent } from "solid-js";
import { splitProps } from "solid-js";

import { cx } from "./cva";

export type AvatarProps<T extends ValidComponent = "span"> = ComponentProps<
  typeof ImagePrimitive<T>
>;

export const Avatar = <T extends ValidComponent = "span">(props: AvatarProps<T>) => {
  const [, rest] = splitProps(props as AvatarProps, ["class"]);

  return (
    <ImagePrimitive
      data-slot="avatar"
      class={cx(
        "relative flex shrink-0 overflow-hidden rounded-full size-8 bg-foreground text-background",
        props.class
      )}
      {...rest}
    />
  );
};

export type AvatarImageProps<T extends ValidComponent = "img"> = ComponentProps<
  typeof ImagePrimitive.Img<T>
>;

export const AvatarImage = <T extends ValidComponent = "img">(props: AvatarImageProps<T>) => {
  const [, rest] = splitProps(props as AvatarImageProps, ["class"]);

  return (
    <ImagePrimitive.Img
      data-slot="avatar-image"
      class={cx("aspect-square size-full object-cover", props.class)}
      {...rest}
    />
  );
};

export type AvatarFallbackProps<T extends ValidComponent = "span"> = ComponentProps<
  typeof ImagePrimitive.Fallback<T>
>;

export const AvatarFallback = <T extends ValidComponent = "span">(
  props: AvatarFallbackProps<T>
) => {
  const [, rest] = splitProps(props as AvatarFallbackProps, ["class"]);

  return (
    <ImagePrimitive.Fallback
      data-slot="avatar-fallback"
      class={cx(
        "flex size-full items-center justify-center font-mono text-[11px] font-semibold",
        props.class
      )}
      {...rest}
    />
  );
};
