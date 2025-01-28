import { Image } from "../types/models"

const MockApi = {
    getHeroImg: () => { },
    getBlogContent: (id) => { }
}

MockApi.getHeroImg = () => {
    return new Image(
        "https://cdn.builder.io/api/v1/image/assets/TEMP/503440a649862347045a6ef1267d8baa287584222619d334f8d720d531f4bfbe?apiKey=581cb509eedd462787009da53a17f69a&",
        "alt",
        "#"
    )
}

MockApi.getBlogContent = (id) => {
    return `    <h1 id="_i-loi-noi-dau-0">I. LỜI NÓI ĐẦU</h1>
    <p>Chào mọi người, cũng lâu rồi mình mới quay lại viết blog sau nhiều sóng gió của năm 2024. Dường như việc
        quay lại chia sẻ technical phần nào giúp mình tìm lại đam mê và cảm hứng lập trình sau nhiều sự việc xảy
        đến.</p>
    <p>Dành cho các bạn đọc mới biết đến mình thì mình cũng xin giới thiệu lại, các bài viết của mình sẽ xoay
        quanh chủ đề liên quan đến các lĩnh vực&nbsp;<strong>Backend, Blockchain</strong>&nbsp;cũng
        như&nbsp;<strong>DevOps.</strong> Ngoài ra, mình cũng viết chia sẻ về suy nghĩ, tâm sự và quan điểm sống
        trên một vài lĩnh vực về tâm lý học, tài chính và phát triển bản thân.</p>
    <p>Và hôm nay là bài viết cuối cùng của năm 2024 cũng như là bài viết thuộc lĩnh vực Technical cuối bằng
        tiếng việt mà mình chia sẻ. Sang năm mới, mình sẽ cố gắng duy trì thói quen viết blog bằng tiếng anh và
        xen kẽ các bài blog tâm sự bằng tiếng việt. Mọi người có thể đón đọc thêm trên blog cá nhân mình nhé.
    </p>
    <p>Nếu mọi người vẫn còn nhớ thì trước đây mình có viết chuỗi bài hướng dẫn về cấu hình và thiết lập
        MongoDB. Các bạn có thể tìm xem lại các bài viết cũ thuộc chuỗi series tại đây nhé:</p>
    <ul>
        <li>Phần 1: cấu hình standalone MongoDB [<a
                href="https://viblo.asia/p/trien-khai-mongodb-voi-docker-tren-digital-ocean-phan-1-standalone-QpmlezED5rd"
                target="_blank">https://viblo.asia/p/trien-khai-mongodb-voi-docker-tren-digital-ocean-phan-1-standalone-QpmlezED5rd</a>]
        </li>
        <li>Phần 2: cấu hình replica set MongoDB [<a
                href="https://viblo.asia/p/trien-khai-mongodb-voi-docker-tren-digital-ocean-phan-2-replica-set-same-vps-4dbZNQLnKYM"
                target="_blank">https://viblo.asia/p/trien-khai-mongodb-voi-docker-tren-digital-ocean-phan-2-replica-set-same-vps-4dbZNQLnKYM</a>]
        </li>
    </ul>
    <p>Sau đó mình có nợ lại một phần thứ ba về sharding mongoDB trên cụm nhiều server. Sau 2 năm, mình quay lại
        để gửi đến các bạn phần cuối cùng để hoàn thiện chuỗi bài viết nhé.</p>
    <h1 id="_ii-nguyen-ly-1">II. NGUYÊN LÝ</h1>
    <h2 id="_1-sharding-la-gi-2">1. Sharding là gì?</h2>
    <p>Sharding là một cơ chế tự động của MongoDB, được thiết kế để phân chia dữ liệu có kích thước lớn thành
        nhiều phần nhỏ và phân tán trên các máy chủ khác nhau (thường gọi là cluster). Cơ chế này đáp ứng ba mục
        tiêu chính:</p>
    <ul>
        <li><strong>Đảm bảo tính "trong suốt" với người dùng</strong></li>
    </ul>
    <p>MongoDB sử dụng một thành phần đặc biệt gọi là <strong>mongos</strong> để thực hiện điều này. Mongos đóng
        vai trò điều phối, định tuyến các yêu cầu đến đúng shard và tổng hợp dữ liệu từ các shard để trả về cho
        client. Nhờ vậy, người dùng không cần biết về cấu trúc cluster phía sau, mà chỉ cảm nhận được họ đang
        làm việc với một máy chủ duy nhất. Đây chính là tính "trong suốt" của hệ thống.</p>
    <ul>
        <li><strong>Duy trì tính sẵn sàng cao cho các thao tác đọc/ghi</strong></li>
    </ul>
    <p>Cluster phải luôn đảm bảo sẵn sàng hoạt động. Để đạt được điều này, mỗi shard trong cluster sẽ được sao
        lưu với ít nhất một tiến trình phục vụ dự phòng trên các máy khác nhau.</p>
    <ul>
        <li><strong>Khả năng mở rộng linh hoạt</strong></li>
    </ul>
    <p>Cluster được thiết kế để dễ dàng mở rộng. Khi cần thêm dung lượng lưu trữ hoặc tăng hiệu suất, người dùng
        có thể thêm các node mới mà không gặp khó khăn. Mỗi cluster được quản lý như một node riêng lẻ và cấu
        hình dễ dàng.</p>
    <p>Mongos là yếu tố quan trọng giúp hiện thực hóa những tính năng này, đảm bảo hệ thống hoạt động mượt mà và
        hiệu quả ngay cả khi quy mô dữ liệu và yêu cầu truy cập tăng cao.</p>
    <h2 id="_2-co-che-cua-sharding-3">2. Cơ chế của sharding</h2>`
}

export default MockApi;