import { Link } from "react-router-dom";
import { brand } from "@/lib/brand";
export function Brand() {
  return (
    <Link to="/" className="brand-link" aria-label="MindShare, início">
      <img src={brand.logo} alt="MindShare" width="1029" height="222" />
    </Link>
  );
}
