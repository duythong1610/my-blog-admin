import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Input, message, Space } from "antd";
import { postApi } from "api/post.api";
import { usePost } from "hooks/usePost";
import { useRef, useState } from "react";
import { PostStatus } from "types/post";
import { PostList } from "../Table/PostList";
import { PostModal, PostModalRef } from "../Modal/PostModal";
interface PropTypes {
  status: PostStatus;
  onFetchSummary: () => void;
}
const PostTab = ({ status, onFetchSummary }: PropTypes) => {
  const postModalRef = useRef<PostModalRef>();
  const [loadingDelete, setLoadingDelete] = useState(false);

  const {
    posts,
    loadingPost,
    fetchPost,
    debounceSearchPost,
    queryPost,
    setQueryPost,
    totalPost,
  } = usePost({
    initQuery: {
      page: 1,
      limit: 50,
      status: status == PostStatus.All ? undefined : status,
      sort: "ASC",
    },
  });

  const handleDeletePost = async (postId: string) => {
    try {
      setLoadingDelete(true);
      const res = await postApi.delete(postId);
      fetchPost();
      message.success("Xóa bài viết thành công!");
    } catch (error) {
    } finally {
      setLoadingDelete(false);
    }
  };

  const handleApprovePost = async (postId: string) => {
    try {
      const res = await postApi.approve(postId);
      message.success("Duyệt bài viết thành công!");
      fetchPost();
      onFetchSummary();
    } catch (error) {}
  };

  const handleRejectPost = async (postId: string, reason: string) => {
    try {
      const res = await postApi.reject(postId, { reason });
      message.success("Từ chối bài viết thành công!");
      fetchPost();
      onFetchSummary();
    } catch (error) {}
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
                if (value) {
                  setQueryPost((prevQuery) => ({
                    ...prevQuery,
                    page: 1,
                    search: value,
                  }));
                } else {
                  setQueryPost((prevQuery) => ({
                    ...prevQuery,
                    page: 1,
                    search: "",
                  }));
                }
              }}
              onKeyDown={(ev) => {
                if (ev.code == "Enter") {
                  fetchPost();
                }
              }}
              placeholder="Tìm kiếm tên bài viết"
            />
          </div>

          <div className="filter-item btn">
            <Button
              onClick={() => {
                fetchPost();
                onFetchSummary();
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
                postModalRef.current?.handleCreate();
              }}
              icon={<PlusOutlined />}
              type="primary"
            >
              Thêm mới
            </Button>
          </div>
        </Space>
      </div>

      <PostList
        onEdit={(record) => postModalRef.current?.handleUpdate(record)}
        dataSource={posts || []}
        loading={loadingPost}
        loadingDelete={loadingDelete}
        pagination={{
          total: totalPost,
          defaultPageSize: queryPost.limit,
          currentPage: queryPost.page,
          onChange: ({ page, limit }) => {
            setQueryPost((prev) => ({ ...prev, page, limit }));
          },
        }}
        onDelete={handleDeletePost}
        showActionColumn={true}
      />
      <PostModal
        onReject={handleRejectPost}
        onApprove={handleApprovePost}
        onFetchSummary={onFetchSummary}
        ref={postModalRef}
        onClose={function (): void {
          throw new Error("Function not implemented.");
        }}
        onSubmitOk={fetchPost}
      />
    </>
  );
};

export default PostTab;
