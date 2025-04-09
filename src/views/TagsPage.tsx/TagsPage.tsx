import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Input, message, Space } from "antd";
import { tagApi } from "api/tag.api";
import { useTag } from "hooks/useTag";
import { useRef, useState } from "react";
import { TagModal, TagModalRef } from "./components/Modal/TagModal";
import { TagList } from "./components/Table/TagList";
interface PropTypes {
  title: string;
}
const TagsPage = ({ title }: PropTypes) => {
  const tagModalRef = useRef<TagModalRef>();
  const [loadingDelete, setLoadingDelete] = useState(false);

  const {
    tags,
    loadingTag,
    fetchTag,
    totalTag,
    debounceSearchTag,
    queryTag,
    setQueryTag,
  } = useTag({
    initQuery: {
      page: 1,
      limit: 50,
    },
  });

  const handleDeleteTag = async (tagId: string) => {
    try {
      setLoadingDelete(true);
      const res = await tagApi.delete(tagId);
      fetchTag();
      message.success("Xóa thẻ bài viết thành công!");
    } catch (error) {
    } finally {
      setLoadingDelete(false);
    }
  };

  return (
    <>
      <div className="filter-container">
        <Space wrap>
          <div className="filter-item w-64">
            <label htmlFor="">Tìm kiếm</label>
            <br />
            <Input
              allowClear
              size="middle"
              onChange={(ev) => {
                const value = ev.currentTarget.value;
                debounceSearchTag(value);
              }}
              onKeyDown={(ev) => {
                if (ev.code == "Enter") {
                  fetchTag();
                }
              }}
              placeholder="Tìm kiếm tên thẻ bài viết"
            />
          </div>

          <div className="filter-item btn">
            <Button
              onClick={() => {
                fetchTag();
              }}
              type="primary"
              icon={<SearchOutlined />}
            >
              Tìm kiếm
            </Button>
          </div>
          <div className="filter-item btn">
            <Button
              onClick={() => {
                tagModalRef.current?.handleCreate();
              }}
              icon={<PlusOutlined />}
              type="primary"
            >
              Thêm mới
            </Button>
          </div>
        </Space>
      </div>

      <TagList
        onEdit={(record) => tagModalRef.current?.handleUpdate(record)}
        dataSource={tags || []}
        loading={loadingTag}
        loadingDelete={loadingDelete}
        pagination={{
          total: totalTag,
          defaultPageSize: queryTag.limit,
          currentPage: queryTag.page,
          onChange: ({ page, limit }) => {
            setQueryTag((prev) => ({ ...prev, page, limit }));
          },
        }}
        onDelete={handleDeleteTag}
        showActionColumn={true}
      />
      <TagModal
        ref={tagModalRef}
        onClose={function (): void {
          throw new Error("Function not implemented.");
        }}
        onSubmitOk={fetchTag}
      />
    </>
  );
};

export default TagsPage;
