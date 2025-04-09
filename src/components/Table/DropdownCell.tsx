import { DownOutlined } from "@ant-design/icons";
import { Dropdown } from "antd";
import { ItemType } from "antd/es/menu/hooks/useItems";

type Props = {
  items: ItemType[] | any;
  text?: string;
};

const DropdownCell = ({ items, text = "Chức năng" }: Props) => {
  return (
    <Dropdown
      overlayClassName="table-action-dropdown [&>ul]:!rounded-none [&>ul]:!border"
      placement="bottomLeft"
      menu={{
        items,
      }}
      trigger={["click"]}
    >
      <span className="text-primary  font-semibold cursor-pointer">
        {/* <Button type="primary" ghost> */}
        {text} <DownOutlined />
        {/* </Button> */}
      </span>
    </Dropdown>
  );
};

export default DropdownCell;
