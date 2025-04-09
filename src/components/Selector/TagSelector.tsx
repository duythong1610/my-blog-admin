import { Select, SelectProps } from "antd";
import useTag from "hooks/useTag";
import { debounce } from "lodash";
import { useEffect, useMemo } from "react";
import { Tag } from "types/tag";
import { uniqueArrayByKey } from "utils/common";

type Props = {
  originData?: Tag[];
  placeholder?: string;
} & SelectProps;

const TagSelector = ({
  originData,
  placeholder = "Chọn thẻ",
  ...props
}: Props) => {
  const { fetchData, data, filterData } = useTag({
    initialQuery: {
      page: 1,
      limit: 50,
    },
  });

  useEffect(() => {
    fetchData();
    return () => {};
  }, []);

  const options = useMemo(() => {
    if (!data) return [];
    if (originData?.length) {
      return uniqueArrayByKey([...data, ...originData], "id");
    } else {
      return data;
    }
  }, [data]);

  const debounceSearch = debounce((search) => {
    filterData({ search });
  }, 300);

  return (
    <Select
      options={options}
      fieldNames={{
        value: "id",
        label: "name",
      }}
      onSearch={debounceSearch}
      placeholder={placeholder}
      {...props}
    ></Select>
  );
};

export default TagSelector;
