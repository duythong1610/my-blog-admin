import { Badge, Card, Tabs } from "antd";
import { useCallback, useEffect, useState } from "react";
import { getTitle } from "utils";
import PostTab from "./components/Tab/PostTab";
import { PostStatus, postStatusTrans } from "types/post";
import { postApi } from "api/post.api";

export const PostPage = ({ title = "" }) => {
  const [tabActive, setTabActive] = useState<PostStatus>(PostStatus.All);
  const [summaryPostOfStatus, setSummaryPostOfStatus] = useState();

  useEffect(() => {
    document.title = getTitle(title);
    fetchSummaryPost();
  }, []);

  const fetchSummaryPost = useCallback(async () => {
    const res = await postApi.summaryStatus();

    if (res.status) {
      setSummaryPostOfStatus(() => {
        const summary = res.data.reduce(
          (prev: any, curr: { status: PostStatus; total: number }) => {
            prev[curr.status] = curr.total;
            prev.ALL = (prev.ALL || 0) + curr.total;
            return prev;
          },
          { ALL: 0 }
        );

        return summary;
      });
    }
  }, []);

  const onChangeTab = useCallback((key: PostStatus) => {
    setTabActive(key as PostStatus);
  }, []);

  return (
    <Card bodyStyle={{ padding: "8px 20px" }} style={{ borderRadius: "8px" }}>
      <Tabs
        destroyInactiveTabPane //Không để vào thì sẽ không fetch lại dữ liệu mỗi khi duyệt
        activeKey={tabActive}
        onChange={(key) => onChangeTab(key as PostStatus)}
        type="line"
        animated={{ inkBar: true, tabPane: true, tabPaneMotion: {} }}
      >
        {Object.values(postStatusTrans).map((item) => (
          <Tabs.TabPane
            tab={
              <div className="flex items-center gap-2">
                {item.label}
                <Badge
                  key={item.value}
                  color={postStatusTrans[item.value]?.color}
                  count={summaryPostOfStatus?.[item.value] || 0}
                />
              </div>
            }
            key={item.value}
            tabKey={item.value}
          >
            <PostTab status={tabActive} onFetchSummary={fetchSummaryPost} />
          </Tabs.TabPane>
        ))}
      </Tabs>
    </Card>
  );
};
