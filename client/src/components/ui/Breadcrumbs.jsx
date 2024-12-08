import { Link } from "react-router";
import cn from "../../utils/cn";
import PropTypes from "prop-types";

export default function Breadcrumbs({ className, items, style }) {
  return (
    <nav
      aria-label="Breadcrumbs"
      className={cn("breadcrumbs", className)}
      style={style}
    >
      <ol>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li
              aria-current={isLast ? "page" : undefined}
              className={cn(isLast && "active")}
              key={index}
            >
              {isLast ? (
                item.label
              ) : (
                <Link className="link" to={item.link ?? ""}>
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

Breadcrumbs.propTypes = {
  className: PropTypes.string,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.node.isRequired,
      link: PropTypes.string,
    })
  ).isRequired,
  style: PropTypes.object,
};
