import { ConfigProvider } from "antd";
import "antd/dist/antd.less";
import viVN from "antd/lib/locale/vi_VN";
import { toJS } from "mobx";
import { observer } from "mobx-react";
import { useEffect } from "react";
import { useRoutes } from "react-router-dom";
import { settings } from "settings";
import { userStore } from "store/userStore";
import { initUUID } from "utils/devide";
import { routes } from "./router";
import "./styles/AntDesign.scss";
import "./styles/App.scss";

const App = observer(() => {
  const account = toJS(userStore);

  useEffect(() => {
    initUUID();
  }, [account.token]);

  const element = useRoutes(routes);

  return (
    <ConfigProvider locale={viVN}>
      <div className="App">{element}</div>
    </ConfigProvider>
  );
});

export default App;
