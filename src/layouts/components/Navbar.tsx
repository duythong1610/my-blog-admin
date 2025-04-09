import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Breadcrumb, Dropdown, Menu, Space, Tag } from "antd";
import Avatar from "antd/lib/avatar/avatar";
import { Header } from "antd/lib/layout/layout";
import { observer } from "mobx-react";
import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Route, adminRoutes } from "router";
import { settings } from "settings";
import { userStore } from "store/userStore";
import { QueryParam } from "types/query";
import { $url } from "utils/url";
export const Navbar = observer(
  ({ collapsed, toggle }: { collapsed: boolean; toggle: () => void }) => {
    const location = useLocation();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [breadcrumbs, setBreadcrumbs] = useState<string[]>([]);
    const countNotificationUnread = useRef<number>(0);
    const notificationQuery = useRef<QueryParam>({
      limit: 10,
      page: 1,
    });

    const handleSetBreadcrumbs = (data: Route) => {
      if (data) {
        if (data.breadcrumb) {
          setBreadcrumbs(data.breadcrumb.split("/"));
        } else if (data.title) {
          setBreadcrumbs([data.title]);
        }
      }
    };

    useEffect(() => {
      adminRoutes.forEach((router) => {
        // console.log("router", router);
        // if (router.name == "/product") {
        //   debugger;
        // }
        if (router.path == location.pathname) {
          return handleSetBreadcrumbs(router);
        } else if (router.children?.length) {
          const findChild = router.children?.find((child) => {
            // console.log("childPath", (router.path || "") + child.path);

            return (router.path || "") + "/" + child.path == location.pathname;
          });
          if (findChild) {
            // console.log("findChild", findChild);

            return handleSetBreadcrumbs(findChild);
          }
        }
      });
    }, [location.pathname]);

    // const findRoute = (routes: Route[], pathname: string) =>
    //   routes.find((route) => pathname.includes(route.path as string));

    // useEffect(() => {
    //   const currentRoute = findRoute(adminRoutes, location.pathname);
    //   const generateBreadcrumbs = (
    //     route: Route | undefined,
    //     crumbs: string[] = []
    //   ) => {
    //     if (route) {
    //       //@ts-ignore
    //       crumbs.unshift({
    //         path: route.path,
    //         breadcrumb: route.breadcrumb,
    //       });

    //       if (route.children) {
    //         const childRoute = findRoute(route.children, location.pathname);
    //         generateBreadcrumbs(childRoute, crumbs);
    //       }
    //     }
    //   };

    //   const breadcrumbList: string[] = [];
    //   generateBreadcrumbs(currentRoute, breadcrumbList);
    //   setBreadcrumbs(breadcrumbList);
    // }, [location.pathname]);

    const menu = (
      <Menu>
        <Menu.Item key={"profile"}>
          <Link to="/account-profile">Cá nhân</Link>
        </Menu.Item>

        <Menu.Item key={"login"}>
          <Link
            to={"/login"}
            onClick={() => {
              userStore.logout();
            }}
          >
            Đăng xuất
          </Link>
        </Menu.Item>
      </Menu>
    );

    return (
      <Header
        className={`site-layout-background ${collapsed ? "collapsed" : ""}`}
        style={{ padding: 0 }}
      >
        <div>
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: "trigger",
              onClick: toggle,
            }
          )}
          <Breadcrumb
            separator={<span className="text-primary">/</span>}
            style={{ display: "inline-block" }}
            className={!collapsed ? "mobile-breadcrumb-none" : ""}
          >
            {breadcrumbs.map((item, i) => (
              <Breadcrumb.Item key={i} className="font-medium text-primary">
                {item}
              </Breadcrumb.Item>
            ))}
          </Breadcrumb>
        </div>

        <Space
          size={30}
          style={{ flex: 1, justifyContent: "flex-end", marginRight: "20px" }}
        >
          {/* <div className="flex items-center">
            <Switch
              className="custom-switch"
              loading={loading}
              checked={isSubscribed}
              onChange={handleChangePushNotification}
            ></Switch>
            <span
              className="hidden md:block"
              style={{
                fontWeight: "600",
                marginLeft: 10,
              }}
            >
              Bật thông báo đẩy
            </span>
            <Tooltip title="Bật thông báo đẩy">
              <BellOutlined className="md:hidden ml-2 text-white text-xl" />
            </Tooltip>
            {isBlocked && (
              <Tooltip
                overlayClassName="notification-tooltip"
                trigger={"click"}
                visible={isVisibleNotiError}
                placement="bottom"
                overlayInnerStyle={{
                  backgroundColor: "white",
                  color: "black",
                }}
                title={
                  <div
                    style={{
                      position: "relative",
                      padding: 10,
                    }}
                  >
                    {errorMessage}
                    <div
                      onClick={() => {
                        setIsVisibleNotiError(false);
                      }}
                      className="close-btn"
                      style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                      }}
                    >
                      <CloseOutlined></CloseOutlined>
                    </div>
                  </div>
                }
              ></Tooltip>
            )}
            {/* <span
              className="noti-warning-btn"
              style={{
                cursor: "pointer",
                marginLeft: 10,
              }}
              onClick={() => notiGuide.current?.open({})}
            ></span> */}
          {/* </div> */}

          <label
            style={{
              paddingLeft: "10px",
              color: "#a855f7",
            }}
            htmlFor=""
          >
            v{settings.version}
          </label>
          {/* <Dropdown
            trigger={["click"]}
            placement="bottomCenter"
            overlay={
              <NotificationOverlay
                onScroll={handleOnScrollToBottom}
                notifications={notifications}
                loading={loading}
                onRefreshNoti={fetchNotification}
              />
            }
          >
            <div style={{ cursor: "pointer", display: "inline-block" }}>
              <Badge count={countNotificationUnread.current}>
                <BellFilled style={{ color: "#0757A2", fontSize: "20px" }} />
              </Badge>
            </div>
          </Dropdown> */}

          <Dropdown trigger={["click"]} overlay={menu}>
            <div style={{ cursor: "pointer", display: "inline-block" }}>
              <Avatar
                size={"large"}
                src={$url(userStore.info.avatar)}
                style={{
                  color: "#f56a00",
                  backgroundColor: "#fde3cf",
                  marginBottom: "10px",
                }}
              >
                {userStore.info.fullName?.[0]}
              </Avatar>
              {/* <CaretDownOutlined style={{ color: "#fff", marginLeft: 4 }} /> */}
            </div>
          </Dropdown>
          {/* {userStore.info.avatar ? (
            <Image
              width={40}
              src={$url(userStore.info.avatar)}
              style={{ borderRadius: "50%" }}
              fallback={require("assets/images/user.png")}
            />
          ) : (
            <img
              width={40}
              alt=""
              style={{ borderRadius: "50%" }}
              src={require("assets/images/user.png")}
            />
          )} */}
        </Space>
      </Header>
    );
  }
);
