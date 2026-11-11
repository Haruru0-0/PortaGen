import type { FormEvent, RefObject } from "react"

export interface LockScreenStyleProps {
  /** Formatted clock, e.g. "9:41 AM" */
  time: string
  /** Formatted date, e.g. "Tuesday, November 11" */
  date: string
  preview: boolean
  showLogin: boolean
  inputPassword: string
  onInputChange: (value: string) => void
  onSubmit: (e: FormEvent) => void
  onCancel: () => void
  onClickSound: () => void
  /** Text for the password hint line; empty hides it. */
  hint: string
  /** Theme colors, used by the pixel style. */
  colors: { primary: string; secondary: string; accent: string; background: string; text: string }
  /** Refs the parent animates with GSAP. Each style attaches the ones it renders. */
  timeRef: RefObject<HTMLHeadingElement | null>
  dateRef: RefObject<HTMLParagraphElement | null>
  hintRef: RefObject<HTMLParagraphElement | null>
  overlayRef: RefObject<HTMLDivElement | null>
  cardRef: RefObject<HTMLDivElement | null>
  xButtonRef: RefObject<HTMLButtonElement | null>
  inputRef: RefObject<HTMLInputElement | null>
}
