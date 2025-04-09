import { BarsOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import Sider from "antd/lib/layout/Sider";
import SubMenu from "antd/lib/menu/SubMenu";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { adminRoutes } from "router";
import { settings } from "settings";

export const Sidebar = observer(({ collapsed }: { collapsed: boolean }) => {
  const [defaultOpenKeys, setDefaultOpenKeys] = useState<string[]>([]);
  const location = useLocation();
  const [isLoaded, setIsLoaded] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  console.log(adminRoutes);

  return (
    <Sider trigger={null} collapsible collapsed={collapsed} width={250}>
      <div className="ml-6 p-2 flex gap-4 min-h-[64px] items-center"></div>

      {isLoaded && (
        <Menu
          className="sidebar custom-scrollbar"
          theme="light"
          mode="inline"
          inlineCollapsed={collapsed}
          selectedKeys={[location.pathname]}
          defaultOpenKeys={defaultOpenKeys}
          forceSubMenuRender
        >
          {adminRoutes.map((route) => {
            if (route.children?.length) {
              console.log(route);
              return (
                <SubMenu key={route.path} icon={route.icon} title={route.title}>
                  {route.children
                    .filter((item) => !item.hidden)
                    .map((item) => {
                      return (
                        <Menu.Item
                          icon={item.icon}
                          key={route.path + "/" + item.path}
                        >
                          {route.path && item.path && (
                            <Link to={route.path + "/" + item.path}>
                              {item.title}{" "}
                            </Link>
                          )}
                        </Menu.Item>
                      );
                    })}
                </SubMenu>
              );
            } else {
              console.log({ route });
              return (
                <Menu.Item icon={route.icon} key={route.path}>
                  <Link to={route.path || ""}>{route.title}</Link>
                </Menu.Item>
              );
            }
          })}
        </Menu>
      )}
    </Sider>
  );
});
