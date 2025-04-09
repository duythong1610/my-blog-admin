# VITADAIRY ADMIN

## v1.0.68 (26-02-2024)

## Fix

- Chỉnh limit khi request export excel (từ 50 lên 500)
- Cập nhật trạng thái quét mã khi export excel lịch sử quét mã => 3 trạng thái (Tích thành công, thành công, thất bại)

## v1.0.67 (07-02-2024)

#### Updates

- Thêm tab lịch sử đổi quà của bé và shop trong modal cửa hàng tổng
- SDT chủ shop lên cùng trong tab nhân viên trong cửa hàng
- Sửa feedback Usecase 1.1, 1.2, 2
- Giới hạn 80 ký tự cho tên quà, giới hạn dung lượng ảnh upload khi tạo quà thành 1MB
- Thêm trạng thái tích thành công cho lịch sử quét mã

#### Bugs Fixed

- Bug tại lịch sử quét mã, nếu đang xem 1 shop, sau đó xem shop khác nhưng chưa bấm tìm kiếm ở lịch sử quét chi tiết thì hệ thống đang hiện cái của shop cũ, đúng ra phải hiện màn hình trống

## v1.0.66 (26-01-2024)

#### Features

- **Tạo quà (Shop):** Sửa cơ chế cập nhật quà từ Got It

#### Bugs Fixed

- Fix xuất excel danh sách quà

## v1.0.65 (25-01-2024)

#### Features

- **Lịch sử đổi quà (Shop):** Chi tiết QR đã sử dụng để đổi quà. Bổ sung cột "Giá trị quà"

#### Bugs Fixed

- Sửa xuất file Excel lịch sử đổi quà (Shop)

## v1.0.64 (24-01-2024)

#### Features

- Tách "Danh sách quà" thành 2 menu lớn "Quà tặng (Bé)" và "Quà tặng (Shop)"
- Thêm số tiền khi tạo quà

## v1.0.63 (24-01-2024)

#### Features

- Thêm label theo dõi version
- Thêm version trong request header

## v1.0.62 (23-01-2024)

#### Features

- Tách "Danh sách quà" thành "Danh sách quà (Shop)" và "Danh sách quà (Bé)"
- Tách "Lịch sử đổi quà" thành "Lịch sử đổi quà (Shop)" và "Lịch sử đổi quà (Bé)"

## v1.0.61 (23-01-2024)

#### Features

- Fill điểm theo loại bảo bối
- Đăng xuất tài khoản

## v1.0.60 (22-01-2024)

#### Features

- Chọn bảo bối
- Xóa hàng loạt QR

## v1.0.59 (22-01-2024)

#### Features

- Đồng bộ quà với Gotit
- Sửa cấu hình deploy production

## v1.0.58 (19-01-2024)

#### Features

- Thông báo đẩy sau khi tạo mã

---
