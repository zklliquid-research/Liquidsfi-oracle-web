import { NavLink, useLocation } from "react-router-dom";
import { SidebarContext } from "../../context/SidebarContext";
import clsx from "clsx";
import { useContext, useEffect, useState } from "react";

function SidebarLink({ link }) {
  // const [active, setActive] = useState(false);
  // const location = useLocation();

  const active =
    link?.path === `${window?.location?.origin}/${window?.location?.pathname}`;

  // console.log("location is", location);
  console.log(
    "the window ref",
    `${window?.location?.origin}/${window?.location?.pathname}`
  );

  const { isOpenSidebar, setIsOpenSidebar } = useContext(SidebarContext);

  return (
    <NavLink
      to={link.path}
      onClick={() => setIsOpenSidebar(false)}
      className={`flex items-center gap-2 py-3 px-4 hover:text-white transition-colors font-medium ${
        active ? "text-white bg-dark-300" : "text-dark-100"
      }`}
    >
      <span
        style={{ transition: "margin .2s ease" }}
        className={clsx(
          active && "text-primary",
          isOpenSidebar ? "ml-0" : "ml-3 xl:ml-0"
        )}
      >
        {link.icon}
      </span>

      <span
        className={clsx(
          "transition-opacity whitespace-nowrap",
          isOpenSidebar ? "md:opacity-100" : "md:opacity-0 xl:opacity-100"
        )}
      >
        {link.title}
      </span>
    </NavLink>
  );
}

export default SidebarLink;
