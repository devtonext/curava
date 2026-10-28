import SmartLink from "./SmartLink";
import { ArrowIcon } from "./Icons";

// Pill button with the round arrow badge. Renders a link when `to` is set, otherwise a <button>.
export default function Button({ to, variant, children, className = "", ...rest }) {
  const cls = `btn${variant ? ` btn--${variant}` : ""} ${className}`.trim();
  const inner = (
    <>
      {children}
      <span className="arrow"><ArrowIcon /></span>
    </>
  );
  if (to) return <SmartLink to={to} className={cls} {...rest}>{inner}</SmartLink>;
  return <button className={cls} {...rest}>{inner}</button>;
}
