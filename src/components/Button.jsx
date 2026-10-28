import { Link } from "react-router-dom";
import { ArrowIcon } from "./Icons";

// Pill button with the round arrow badge. Renders a router Link, an <a>, or a <button>.
export default function Button({ to, href, variant, children, className = "", ...rest }) {
  const cls = `btn${variant ? ` btn--${variant}` : ""} ${className}`.trim();
  const inner = (
    <>
      {children}
      <span className="arrow"><ArrowIcon /></span>
    </>
  );
  if (to) return <Link to={to} className={cls} {...rest}>{inner}</Link>;
  if (href) return <a href={href} className={cls} {...rest}>{inner}</a>;
  return <button className={cls} {...rest}>{inner}</button>;
}
