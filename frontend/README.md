Lab 2: Appserver và Database (Máy chủ ứng dụng và Cơ sở dữ liệu)
Trong bài lab này, bạn sẽ khởi động một hệ thống cơ sở dữ liệu và phát triển một ứng dụng backend để kết nối với cơ sở dữ liệu đó, đồng thời cung cấp các API cho ứng dụng frontend đã phát triển ở Lab 1. Chúng tôi cung cấp cho bạn một khung ứng dụng backend (skeleton app) hỗ trợ các giao diện và thiết lập sẵn kết nối tới cơ sở dữ liệu.

Cài đặt (Setup)
Bạn cần cài đặt MongoDB và Node.js trên hệ thống.
Tạo thư mục tên là lab2 và giải nén tệp zip đính kèm vào đó.
Cài đặt các phần mềm phụ thuộc bằng lệnh: npm install.
Khởi tạo cơ sở dữ liệu MongoDB
Đảm bảo bạn đã thiết lập tài khoản và cơ sở dữ liệu trên MongoDB Atlas.
Tải bộ dữ liệu ứng dụng ảnh bằng lệnh: node ./db/dbLoad.js.
Chương trình này sẽ nạp dữ liệu mẫu từ các dự án trước vào cơ sở dữ liệu.
Vì ứng dụng hiện chưa hỗ trợ thêm/cập nhật, bạn chỉ cần chạy lệnh này một lần.
Lệnh này sẽ xóa dữ liệu cũ trước khi nạp mới nên có thể chạy nhiều lần nếu cần.
Chúng ta sử dụng MongooseJS (ODL) để định nghĩa Schema (lược đồ) lưu trữ dữ liệu. Các tệp định nghĩa nằm trong thư mục db/:
userModel.js: Định nghĩa tập hợp (collection) User (Người dùng).
photoModel.js: Định nghĩa tập hợp Photos (Ảnh) và các đối tượng Comments (Bình luận).
schemaInfo.js: Định nghĩa thông tin phiên bản của Schema.

Vấn đề 1: Xây dựng ứng dụng backend sử dụng cơ sở dữ liệu (40 điểm)
Bạn cần xây dựng các API hỗ trợ các URL sau để trả về dữ liệu mô hình (model) phù hợp:
/user/list: Trả về danh sách người dùng cho thanh điều hướng bên trái.
Chỉ trả về các thuộc tính cần thiết: _id, first_name, last_name.
/user/:id: Trả về thông tin chi tiết của người dùng có ID tương ứng.
Các thuộc tính: _id, first_name, last_name, location, description, occupation.
Nếu ID không hợp lệ, trả về mã trạng thái HTTP 400 kèm thông báo lỗi.
/photosOfUser/:id: Trả về tất cả ảnh và bình luận của người dùng có ID tương ứng.
Thông tin ảnh gồm: _id, user_id, comments, file_name, date_time.
Thông tin bình luận gồm: comment, date_time, _id và đối tượng user tối giản (_id, first_name, last_name).
Nếu ID không hợp lệ, trả về mã trạng thái HTTP 400.
Lưu ý quan trọng:
Dữ liệu trả về từ API không hoàn toàn giống hệt dữ liệu trong cơ sở dữ liệu; bạn cần xử lý (cắt tỉa hoặc bổ sung) để phù hợp với giao diện người dùng.
Không được phép thay đổi Schema của cơ sở dữ liệu.
Mongoose trả về các đối tượng đặc biệt. Cách tốt nhất để xử lý là tạo một đối tượng JavaScript mới và sao chép các trường cần thiết vào đó trước khi gửi phản hồi.

Vấn đề 2: Lấy dữ liệu từ backend cho frontend (10 điểm)
Chuyển đổi ứng dụng frontend để lấy dữ liệu từ backend thay vì dùng dữ liệu mẫu có sẵn:
Triển khai hàm fetchModel trong tệp lib/fetchModelData.js.
Sửa đổi mã nguồn trong các thành phần sau để sử dụng hàm fetchModel:
UserDetail/index.jsx
UserList/index.jsx
UserPhotos/index.jsx

Điểm thưởng (10 điểm)
Thêm tính năng mạng xã hội cho thanh điều hướng bên trái:
Hiển thị hai "bong bóng" đếm số lượng bên cạnh tên mỗi người dùng:
Màu xanh lá: Số lượng ảnh người dùng đã đăng.
Màu đỏ: Số lượng bình luận người dùng đã viết.
Khi nhấn vào bong bóng màu đỏ (bình luận), ứng dụng sẽ chuyển sang một giao diện mới hiển thị tất cả các bình luận của người dùng đó, kèm theo ảnh thu nhỏ (thumbnail) của bức ảnh được bình luận.
Nhấn vào bình luận hoặc ảnh thu nhỏ sẽ dẫn người dùng đến trang chi tiết của bức ảnh đó.

