import { Tag } from "antd"

interface IRenderStatusTag{
    status: boolean,
    width?: number //*Độ rộng chung của các Tag,
    colors?: string[], //*Danh sách màu. Mặc định từ trái qua là green, red, blue
    contents?: string[] //*Danh sách content của tag. Mặc định từ trái qua là Đang hoạt động và Đã bị khóa 
}

const defaultColors = ["green", "red", "blue"]
const defaultContents = ["Đang hoạt động", "Đã bị khóa"]
const defaultWidth = 120

export const renderTwoStatusTag = ({status, width = defaultWidth, colors = defaultColors, contents = defaultContents}: IRenderStatusTag) => {
    return status ? 
    <Tag color={colors[0]} style={{width, textAlign: "center"}}>{contents[0]}</Tag>
    :
    <Tag color={colors[1]} style={{width, textAlign: "center"}}>{contents[1]}</Tag>
}
