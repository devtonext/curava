import { Link } from "react-router-dom";

/** Internal paths use the router; anything else becomes a normal link. */
export default function SmartLink({ to = "", children, ...rest }) {
  if (to.startsWith("/")) return <Link to={to} {...rest}>{children}</Link>;
  const external = /^https?:/.test(to);
  return <a href={to} {...(external ? { target: "_blank", rel: "noreferrer" } : {})} {...rest}>{children}</a>;
}
