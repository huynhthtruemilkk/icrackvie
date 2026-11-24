window.OPENOPEN_COURSES = [
  {
    "id": "html",
    "name": "HTML",
    "tag": "Cấu trúc trang web",
    "symbol": "5",
    "color": "#f2682b",
    "level": "Cơ bản",
    "duration": "4 chương · 45–60 phút",
    "description": "Học cách tạo cấu trúc trang web bằng những thẻ HTML rõ ràng, có ý nghĩa và dễ truy cập.",
    "goal": "Tự dựng được một trang giới thiệu có tiêu đề, nội dung, hình ảnh, liên kết và biểu mẫu.",
    "lessons": [
      {
        "title": "Khung HTML đầu tiên",
        "intro": "HTML mô tả cấu trúc và ý nghĩa của nội dung. Trình duyệt đọc các thẻ rồi hiển thị chúng thành trang web.",
        "body": [
          "Một tài liệu HTML thường bắt đầu bằng <!doctype html> để trình duyệt dùng chế độ chuẩn.",
          "Thẻ <html> bao toàn bộ tài liệu. Phần <head> chứa thông tin cấu hình, còn <body> chứa nội dung người xem nhìn thấy.",
          "Phần lớn thẻ có thẻ mở và thẻ đóng, ví dụ <p> ... </p>.",
          "Thuộc tính lang giúp trình duyệt và công cụ hỗ trợ biết ngôn ngữ chính của trang."
        ],
        "code": "<!doctype html>\n<html lang=\"vi\">\n<head>\n  <meta charset=\"UTF-8\">\n  <title>Trang đầu tiên</title>\n</head>\n<body>\n  <h1>Xin chào!</h1>\n  <p>Tôi đang học HTML.</p>\n</body>\n</html>",
        "output": "Trang hiển thị tiêu đề lớn: Xin chào!\nBên dưới là dòng: Tôi đang học HTML.",
        "task": "Tạo một trang có tiêu đề “Góc học tập” và một đoạn văn giới thiệu sở thích học code.",
        "hint": "Đặt nội dung nhìn thấy được bên trong <body>. Dùng <h1> cho tiêu đề chính và <p> cho đoạn văn.",
        "solution": "<body>\n  <h1>Góc học tập</h1>\n  <p>Mình thích học lập trình.</p>\n</body>"
      },
      {
        "title": "Tiêu đề, đoạn văn và liên kết",
        "intro": "Các thẻ HTML biểu đạt vai trò của nội dung, không chỉ quyết định cách nó trông như thế nào.",
        "body": [
          "Dùng <h1> cho tiêu đề chính; <h2> và <h3> cho các cấp tiêu đề nhỏ hơn.",
          "Dùng <p> cho đoạn văn. Đừng chọn thẻ chỉ vì mặc định nó có kiểu chữ bạn thích.",
          "Liên kết dùng <a href=\"...\">. Văn bản liên kết nên mô tả rõ nơi sẽ mở.",
          "Ảnh dùng <img> với alt mô tả nội dung ảnh để hỗ trợ người dùng dùng trình đọc màn hình."
        ],
        "code": "<h1>Thư viện mini</h1>\n<h2>Sách đang đọc</h2>\n<p>Một nơi lưu các ghi chú hữu ích.</p>\n<a href=\"https://example.com\">\n  Xem tài liệu tham khảo\n</a>\n<img src=\"cover.jpg\" alt=\"Bìa cuốn sách\">",
        "output": "Một tiêu đề chính, tiêu đề phụ, đoạn văn, liên kết và hình ảnh có mô tả.",
        "task": "Thêm tiêu đề phụ “Tài liệu” và liên kết đến một trang mà bạn thường dùng để học.",
        "hint": "Tạo một thẻ <h2>, sau đó đặt thẻ <a> bên dưới. Thuộc tính href chứa địa chỉ trang đích.",
        "solution": "<h2>Tài liệu</h2>\n<a href=\"https://developer.mozilla.org\">MDN Web Docs</a>"
      },
      {
        "title": "Danh sách và biểu mẫu",
        "intro": "Danh sách giúp nhóm thông tin. Biểu mẫu cho phép người dùng gửi dữ liệu vào giao diện.",
        "body": [
          "<ul> tạo danh sách không đánh số; <ol> tạo danh sách có thứ tự. Mỗi mục nằm trong <li>.",
          "Biểu mẫu bắt đầu bằng <form>. Mỗi ô nhập nên có <label> liên kết qua for và id.",
          "Dùng type phù hợp như text, email hoặc password để trình duyệt hỗ trợ nhập liệu tốt hơn.",
          "Nút type=\"submit\" gửi biểu mẫu. HTML đơn thuần chưa tự lưu dữ liệu lên máy chủ."
        ],
        "code": "<form>\n  <label for=\"email\">Email</label>\n  <input id=\"email\"\n         name=\"email\" type=\"email\" required>\n  <button type=\"submit\">Đăng ký</button>\n</form>",
        "output": "Biểu mẫu có nhãn Email, ô nhập email và nút Đăng ký.",
        "task": "Tạo biểu mẫu đăng ký gồm tên, email và nút gửi. Mỗi ô nhập phải có nhãn.",
        "hint": "Mỗi cặp label/input dùng for và id giống nhau. Đừng quên đặt type cho input.",
        "solution": "<label for=\"name\">Tên</label>\n<input id=\"name\" name=\"name\" type=\"text\">\n<label for=\"email\">Email</label>\n<input id=\"email\" name=\"email\" type=\"email\">\n<button type=\"submit\">Gửi</button>"
      },
      {
        "title": "HTML ngữ nghĩa và trang hoàn chỉnh",
        "intro": "HTML ngữ nghĩa dùng đúng thẻ cho đúng khu vực, giúp mã dễ đọc, dễ bảo trì và thân thiện hơn với công cụ hỗ trợ.",
        "body": [
          "<header> thường chứa phần đầu trang hoặc phần đầu một khu vực.",
          "<nav> dành cho nhóm liên kết điều hướng; <main> chứa nội dung chính của trang.",
          "<section> nhóm nội dung cùng chủ đề; <article> là phần nội dung có thể đứng độc lập.",
          "<footer> thường chứa thông tin cuối trang. Một tài liệu nên có cấu trúc rõ ràng."
        ],
        "code": "<header>\n  <h1>Open Open Notes</h1>\n  <nav><a href=\"#about\">Giới thiệu</a></nav>\n</header>\n<main>\n  <section id=\"about\">\n    <h2>Về trang này</h2>\n    <p>Nơi ghi lại hành trình học code.</p>\n  </section>\n</main>\n<footer>By OpenDev</footer>",
        "output": "Trang có đầu trang, điều hướng, nội dung chính và chân trang rõ ràng.",
        "task": "Dựng trang giới thiệu cá nhân với header, nav, main, hai section và footer.",
        "hint": "Lên sơ đồ các khu vực trước. Chỉ dùng một main cho nội dung chính của trang.",
        "solution": "<header><h1>Hồ sơ của tôi</h1></header>\n<nav><a href=\"#skills\">Kỹ năng</a></nav>\n<main>\n  <section><h2>Giới thiệu</h2></section>\n  <section id=\"skills\"><h2>Kỹ năng</h2></section>\n</main>\n<footer>By OpenDev</footer>"
      }
    ]
  },
  {
    "id": "css",
    "name": "CSS",
    "tag": "Thiết kế giao diện",
    "symbol": "#",
    "color": "#2f6bff",
    "level": "Cơ bản",
    "duration": "4 chương · 50–70 phút",
    "description": "Biến HTML thành giao diện đẹp, responsive và có chuyển động tinh tế bằng CSS.",
    "goal": "Tự thiết kế một trang có màu sắc, bố cục, thẻ nội dung và khả năng hiển thị tốt trên điện thoại.",
    "lessons": [
      {
        "title": "Bộ chọn và thuộc tính",
        "intro": "CSS mô tả cách trình duyệt trình bày các phần tử HTML. Một quy tắc gồm bộ chọn và nhóm khai báo.",
        "body": [
          "Bộ chọn tên thẻ như p tác động lên tất cả thẻ p.",
          ".class chọn phần tử có class tương ứng; #id chọn phần tử có id đó.",
          "Thuộc tính nằm bên trái dấu hai chấm, giá trị nằm bên phải. Mỗi khai báo kết thúc bằng dấu chấm phẩy.",
          "Có thể tách CSS sang tệp riêng rồi liên kết bằng thẻ <link> trong head."
        ],
        "code": "/* styles.css */\nbody {\n  font-family: system-ui, sans-serif;\n  color: #0f1e33;\n}\n.title {\n  color: #2f6bff;\n  font-size: 32px;\n}\n#intro {\n  line-height: 1.7;\n}",
        "output": "Văn bản dùng font hệ thống; .title có màu xanh và cỡ 32px.",
        "task": "Tạo class .highlight có nền xanh nhạt, màu chữ xanh đậm và padding 8px.",
        "hint": "Khai báo background, color và padding bên trong .highlight.",
        "solution": ".highlight {\n  background: #eaf1ff;\n  color: #2454c6;\n  padding: 8px;\n}"
      },
      {
        "title": "Box model và khoảng cách",
        "intro": "Mỗi phần tử được trình duyệt bố trí như một chiếc hộp. Hiểu box model sẽ giúp kiểm soát kích thước dễ dàng.",
        "body": [
          "Content là vùng nội dung; padding là khoảng trống bên trong đường viền.",
          "Border bao quanh padding và content. Margin tạo khoảng cách bên ngoài phần tử.",
          "Dùng box-sizing: border-box để width và height bao gồm cả padding lẫn border.",
          "Border-radius tạo góc bo tròn; box-shadow tạo bóng đổ."
        ],
        "code": "* { box-sizing: border-box; }\n.card {\n  width: 320px;\n  padding: 24px;\n  border: 1px solid #dce6f5;\n  margin: 16px;\n  border-radius: 20px;\n  box-shadow: 0 12px 30px #1e5aaa18;\n}",
        "output": "Một thẻ rộng 320px, có padding 24px, viền mảnh, góc bo và bóng nhẹ.",
        "task": "Tạo .panel có padding 20px, viền 1px màu xám nhạt và bo góc 16px.",
        "hint": "Kết hợp padding, border và border-radius. Đặt box-sizing: border-box ở đầu CSS.",
        "solution": ".panel {\n  box-sizing: border-box;\n  padding: 20px;\n  border: 1px solid #dce6f5;\n  border-radius: 16px;\n}"
      },
      {
        "title": "Flexbox và Grid",
        "intro": "Flexbox phù hợp để sắp xếp phần tử theo một chiều. Grid tạo bố cục theo hàng và cột.",
        "body": [
          "display: flex thường dùng cho thanh điều hướng, nhóm nút hoặc hàng thẻ.",
          "gap tạo khoảng cách giữa các phần tử mà không cần đặt margin cho từng phần tử.",
          "display: grid kết hợp grid-template-columns để định nghĩa các cột.",
          "repeat() và minmax() giúp tạo lưới linh hoạt theo kích thước màn hình."
        ],
        "code": ".toolbar {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n}\n.course-grid {\n  display: grid;\n  grid-template-columns:\n    repeat(3, minmax(0, 1fr));\n  gap: 20px;\n}",
        "output": "Thanh công cụ căn giữa theo chiều dọc; danh sách khóa học có ba cột bằng nhau.",
        "task": "Tạo lưới thẻ gồm hai cột trên màn hình lớn và một cột trên màn hình nhỏ.",
        "hint": "Dùng grid-template-columns: repeat(2, 1fr), rồi đổi thành 1fr trong media query.",
        "solution": ".grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }\n@media (max-width: 640px) { .grid { grid-template-columns: 1fr; } }"
      },
      {
        "title": "Responsive và animation",
        "intro": "Responsive giúp giao diện thích nghi với nhiều kích thước màn hình. Animation nên hỗ trợ trải nghiệm thay vì làm người dùng mất tập trung.",
        "body": [
          "Media query áp dụng CSS khi điều kiện màn hình phù hợp.",
          "Dùng max-width: 100% cho ảnh để ảnh không tràn khỏi khung.",
          "transition làm thay đổi thuộc tính mượt khi trạng thái thay đổi, ví dụ hover.",
          "prefers-reduced-motion cho phép giảm chuyển động với người dùng đã bật tùy chọn này."
        ],
        "code": ".button {\n  transform: translateY(0);\n  transition: transform .25s ease;\n}\n.button:hover {\n  transform: translateY(-3px);\n}\n@media (max-width: 700px) {\n  .hero { grid-template-columns: 1fr; }\n}\n@media (prefers-reduced-motion: reduce) {\n  *, *::before, *::after {\n    animation-duration: .01ms !important;\n    transition-duration: .01ms !important;\n  }\n}",
        "output": "Nút nhích nhẹ khi hover; hero chuyển thành một cột trên màn hình hẹp.",
        "task": "Làm thẻ .card nhích lên 4px khi hover và tắt chuyển động khi người dùng yêu cầu giảm motion.",
        "hint": "Dùng transform trong :hover và media query prefers-reduced-motion.",
        "solution": ".card { transition: transform .2s ease; }\n.card:hover { transform: translateY(-4px); }\n@media (prefers-reduced-motion: reduce) { .card { transition: none; } }"
      }
    ]
  },
  {
    "id": "javascript",
    "name": "JavaScript",
    "tag": "Lập trình cho web",
    "symbol": "JS",
    "color": "#d59a00",
    "level": "Cơ bản",
    "duration": "4 chương · 60–80 phút",
    "description": "Học biến, điều kiện, vòng lặp, hàm và cách làm cho trang web phản hồi theo thao tác của người dùng.",
    "goal": "Viết được logic cơ bản và xử lý sự kiện trên một trang web.",
    "lessons": [
      {
        "title": "Biến và kiểu dữ liệu",
        "intro": "Biến là tên đại diện cho một giá trị. JavaScript có let và const để khai báo biến.",
        "body": [
          "Dùng const khi không cần gán lại biến; dùng let khi giá trị sẽ thay đổi.",
          "Các kiểu dữ liệu thường gặp gồm string, number, boolean, null và undefined.",
          "Toán tử + có thể cộng số hoặc nối chuỗi tùy kiểu dữ liệu.",
          "console.log() giúp xem giá trị trong bảng điều khiển của trình duyệt."
        ],
        "code": "const learner = \"An\";\nlet lessonsDone = 2;\nconst isLearning = true;\n\nlessonsDone = lessonsDone + 1;\nconsole.log(learner);\nconsole.log(lessonsDone);\nconsole.log(isLearning);",
        "output": "An\n3\ntrue",
        "task": "Tạo biến const chứa tên một ngôn ngữ và biến let đếm số bài đã hoàn thành. Tăng bộ đếm thêm 1.",
        "hint": "Dùng const cho tên ngôn ngữ và let cho bộ đếm. Sau đó dùng phép cộng.",
        "solution": "const language = \"JavaScript\";\nlet completed = 0;\ncompleted = completed + 1;\nconsole.log(language, completed);"
      },
      {
        "title": "Điều kiện và vòng lặp",
        "intro": "Điều kiện chọn nhánh thực thi. Vòng lặp giúp lặp lại thao tác mà không phải viết cùng một câu lệnh nhiều lần.",
        "body": [
          "if kiểm tra điều kiện; else if kiểm tra điều kiện tiếp theo; else xử lý trường hợp còn lại.",
          "Toán tử so sánh gồm ===, !==, >, <, >= và <=.",
          "for thường dùng khi biết số lần lặp. for...of hữu ích khi duyệt các phần tử trong mảng.",
          "Cẩn thận với điều kiện dừng để tránh vòng lặp chạy mãi."
        ],
        "code": "const score = 82;\nif (score >= 90) {\n  console.log(\"Xuất sắc\");\n} else if (score >= 70) {\n  console.log(\"Đạt\");\n} else {\n  console.log(\"Cần luyện thêm\");\n}\n\nfor (let i = 1; i <= 3; i++) {\n  console.log(i);\n}",
        "output": "Đạt\n1\n2\n3",
        "task": "Duyệt mảng [HTML, CSS, JavaScript] và in từng tên ngôn ngữ ra console.",
        "hint": "Dùng for...of để lấy từng phần tử trong mảng.",
        "solution": "const skills = [\"HTML\", \"CSS\", \"JavaScript\"];\nfor (const skill of skills) {\n  console.log(skill);\n}"
      },
      {
        "title": "Hàm và giá trị trả về",
        "intro": "Hàm gom một nhóm thao tác thành đơn vị có tên, có thể nhận dữ liệu đầu vào và trả kết quả.",
        "body": [
          "Khai báo hàm bằng function hoặc cú pháp arrow function.",
          "Tham số là biến nhận giá trị khi gọi hàm; đối số là giá trị truyền vào.",
          "return trả kết quả về nơi gọi hàm. Lệnh sau return trong cùng nhánh sẽ không chạy.",
          "Một hàm nên tập trung vào một nhiệm vụ dễ mô tả."
        ],
        "code": "function add(a, b) {\n  return a + b;\n}\n\nconst total = add(7, 5);\nconsole.log(total);\n\nconst double = (number) => number * 2;\nconsole.log(double(6));",
        "output": "12\n12",
        "task": "Viết hàm square nhận một số và trả về bình phương của số đó.",
        "hint": "Bình phương là số nhân với chính nó. Dùng return để gửi kết quả ra ngoài.",
        "solution": "function square(number) {\n  return number * number;\n}\nconsole.log(square(5));"
      },
      {
        "title": "DOM và sự kiện",
        "intro": "DOM là mô hình đối tượng của tài liệu HTML. JavaScript có thể tìm phần tử, đổi nội dung và phản hồi thao tác người dùng.",
        "body": [
          "document.querySelector() tìm phần tử đầu tiên khớp với bộ chọn CSS.",
          "textContent đọc hoặc thay nội dung văn bản của phần tử.",
          "addEventListener() đăng ký hàm xử lý sự kiện như click, input hoặc submit.",
          "Đặt script sau phần HTML cần thao tác hoặc dùng thuộc tính defer."
        ],
        "code": "<button id=\"hello\">Bấm thử</button>\n<p id=\"message\">Chưa có thao tác.</p>\n\n<script>\nconst button = document.querySelector(\"#hello\");\nconst message = document.querySelector(\"#message\");\nbutton.addEventListener(\"click\", () => {\n  message.textContent = \"Bạn vừa bấm nút!\";\n});\n</script>",
        "output": "Khi bấm nút, đoạn văn đổi thành: Bạn vừa bấm nút!",
        "task": "Tạo nút tăng bộ đếm. Mỗi lần bấm, con số trên trang tăng thêm 1.",
        "hint": "Tạo biến count, chọn phần tử hiển thị và tăng count bên trong sự kiện click.",
        "solution": "let count = 0;\nconst output = document.querySelector(\"#count\");\ndocument.querySelector(\"#add\").addEventListener(\"click\", () => {\n  count += 1;\n  output.textContent = count;\n});"
      }
    ]
  },
  {
    "id": "python",
    "name": "Python",
    "tag": "Ngôn ngữ dễ đọc, đa dụng",
    "symbol": "Py",
    "color": "#3977c5",
    "level": "Cơ bản",
    "duration": "4 chương · 60–80 phút",
    "description": "Bắt đầu với cú pháp dễ đọc, từ biến và điều kiện đến vòng lặp, hàm và các dự án nhỏ.",
    "goal": "Tạo được chương trình dòng lệnh đơn giản và biết cách chia logic thành hàm.",
    "lessons": [
      {
        "title": "Biến, kiểu dữ liệu và print",
        "intro": "Python chú trọng cú pháp dễ đọc. Bạn có thể lưu dữ liệu trong biến rồi in kết quả bằng print().",
        "body": [
          "Tên biến nên mô tả dữ liệu đang lưu, ví dụ learner_name hoặc score.",
          "Python tự nhận diện kiểu dữ liệu khi gán giá trị. Các kiểu cơ bản gồm str, int, float và bool.",
          "Dùng type() để xem kiểu dữ liệu. Dùng f-string để ghép biến vào chuỗi dễ đọc.",
          "Python phân biệt chữ hoa và chữ thường trong tên biến."
        ],
        "code": "learner = \"An\"\nage = 12\nprogress = 0.5\nis_active = True\n\nprint(learner)\nprint(f\"Tuổi: {age}\")\nprint(type(progress))",
        "output": "An\nTuổi: 12\n<class 'float'>",
        "task": "Tạo biến city chứa tên thành phố và year chứa một số nguyên. In cả hai bằng f-string.",
        "hint": "Cú pháp f-string bắt đầu bằng chữ f trước dấu nháy, rồi đặt tên biến trong { }.",
        "solution": "city = \"Cà Mau\"\nyear = 2026\nprint(f\"Thành phố: {city}, năm: {year}\")"
      },
      {
        "title": "Điều kiện if và so sánh",
        "intro": "Câu lệnh if cho phép chương trình chọn cách xử lý dựa trên một điều kiện đúng hoặc sai.",
        "body": [
          "Python dùng if, elif và else để tạo các nhánh điều kiện.",
          "Dấu hai chấm kết thúc dòng mở khối. Các lệnh bên trong phải thụt lề thống nhất.",
          "Toán tử so sánh thường gặp: ==, !=, >, <, >= và <=.",
          "and, or và not kết hợp hoặc đảo điều kiện logic."
        ],
        "code": "score = 78\n\nif score >= 90:\n    print(\"Xuất sắc\")\nelif score >= 70:\n    print(\"Đạt\")\nelse:\n    print(\"Cần luyện thêm\")",
        "output": "Đạt",
        "task": "Kiểm tra biến temperature. Nếu lớn hơn 30 thì in “Trời nóng”, ngược lại in “Dễ chịu”.",
        "hint": "Viết if temperature > 30: rồi đặt print bên trong khối thụt lề.",
        "solution": "temperature = 32\nif temperature > 30:\n    print(\"Trời nóng\")\nelse:\n    print(\"Dễ chịu\")"
      },
      {
        "title": "Vòng lặp for và while",
        "intro": "Vòng lặp giúp thực hiện lại một nhóm lệnh. Python có for để duyệt dữ liệu và while để lặp khi điều kiện còn đúng.",
        "body": [
          "range(3) tạo các số 0, 1, 2. Điểm kết thúc của range không được tính.",
          "for item in list duyệt từng phần tử trong danh sách.",
          "while tiếp tục khi điều kiện là True. Cần cập nhật biến để vòng lặp có thể kết thúc.",
          "break dừng vòng lặp; continue bỏ qua phần còn lại của lượt hiện tại."
        ],
        "code": "for number in range(1, 4):\n    print(\"Lượt\", number)\n\ncolors = [\"blue\", \"green\"]\nfor color in colors:\n    print(color)",
        "output": "Lượt 1\nLượt 2\nLượt 3\nblue\ngreen",
        "task": "Dùng for và range để in các số chẵn từ 2 đến 10.",
        "hint": "range(2, 11, 2) bắt đầu ở 2, dừng trước 11 và tăng mỗi lần 2.",
        "solution": "for number in range(2, 11, 2):\n    print(number)"
      },
      {
        "title": "Hàm và dự án mini",
        "intro": "Hàm giúp chia chương trình thành các phần có thể tái sử dụng, kiểm tra và sửa độc lập.",
        "body": [
          "Dùng def để khai báo hàm. Khối lệnh của hàm được thụt lề.",
          "Tham số cho phép truyền dữ liệu vào hàm. return trả kết quả về nơi gọi.",
          "Nếu hàm không có return, kết quả mặc định là None.",
          "Hãy thử viết chương trình nhỏ, ví dụ máy tính cộng hai số, bằng cách tách phép tính thành hàm."
        ],
        "code": "def add(a, b):\n    return a + b\n\n\ndef greet(name):\n    return f\"Xin chào, {name}!\"\n\nprint(add(7, 5))\nprint(greet(\"An\"))",
        "output": "12\nXin chào, An!",
        "task": "Viết hàm is_even(number) trả về True nếu số chẵn và False nếu số lẻ.",
        "hint": "Một số chẵn có number % 2 == 0.",
        "solution": "def is_even(number):\n    return number % 2 == 0\n\nprint(is_even(8))"
      }
    ]
  },
  {
    "id": "java",
    "name": "Java",
    "tag": "Ứng dụng và hệ thống",
    "symbol": "J",
    "color": "#e5532d",
    "level": "Trung cấp",
    "duration": "4 chương · 70–90 phút",
    "description": "Làm quen cú pháp có kiểu dữ liệu rõ ràng, điều kiện, vòng lặp, phương thức và lớp trong Java.",
    "goal": "Đọc hiểu chương trình Java cơ bản và xây dựng lớp có dữ liệu cùng phương thức.",
    "lessons": [
      {
        "title": "Cấu trúc chương trình và biến",
        "intro": "Java là ngôn ngữ có kiểu tĩnh. Chương trình thường được tổ chức trong các lớp và bắt đầu chạy từ phương thức main.",
        "body": [
          "Một tệp nguồn công khai thường có tên trùng với tên public class.",
          "main là điểm bắt đầu quen thuộc của ứng dụng Java chạy độc lập.",
          "int, double, boolean và String là những kiểu dữ liệu bạn sẽ gặp sớm.",
          "System.out.println() in một dòng ra màn hình."
        ],
        "code": "public class Main {\n    public static void main(String[] args) {\n        String learner = \"An\";\n        int lessonsDone = 3;\n        boolean active = true;\n\n        System.out.println(learner);\n        System.out.println(lessonsDone);\n        System.out.println(active);\n    }\n}",
        "output": "An\n3\ntrue",
        "task": "Khai báo biến String language và int year, sau đó in chúng ra màn hình.",
        "hint": "Khai báo kiểu dữ liệu trước tên biến, ví dụ String language = \"Java\";.",
        "solution": "String language = \"Java\";\nint year = 2026;\nSystem.out.println(language);\nSystem.out.println(year);"
      },
      {
        "title": "Điều kiện và toán tử",
        "intro": "Java dùng các biểu thức boolean để quyết định nhánh nào sẽ được thực hiện.",
        "body": [
          "if và else tạo nhánh điều kiện; else if dùng khi có nhiều trường hợp.",
          "Dùng == để so sánh kiểu nguyên thủy. Với String, thường dùng equals() để so sánh nội dung.",
          "&& là AND, || là OR và ! là NOT.",
          "Dấu ngoặc nhọn xác định phạm vi của mỗi khối lệnh."
        ],
        "code": "int score = 85;\n\nif (score >= 90) {\n    System.out.println(\"Xuất sắc\");\n} else if (score >= 70) {\n    System.out.println(\"Đạt\");\n} else {\n    System.out.println(\"Cần luyện thêm\");\n}",
        "output": "Đạt",
        "task": "Kiểm tra biến age. In “Đủ điều kiện” khi age >= 18, nếu không in “Chưa đủ điều kiện”.",
        "hint": "Tạo biểu thức age >= 18 bên trong if.",
        "solution": "int age = 16;\nif (age >= 18) {\n    System.out.println(\"Đủ điều kiện\");\n} else {\n    System.out.println(\"Chưa đủ điều kiện\");\n}"
      },
      {
        "title": "Vòng lặp for và while",
        "intro": "Vòng lặp trong Java giúp lặp thao tác theo số lần hoặc theo điều kiện.",
        "body": [
          "for thường gồm phần khởi tạo, điều kiện và bước cập nhật.",
          "while kiểm tra điều kiện trước mỗi lượt lặp.",
          "Mảng có thuộc tính length để biết số phần tử.",
          "break thoát khỏi vòng lặp; continue chuyển sang lượt tiếp theo."
        ],
        "code": "for (int i = 1; i <= 3; i++) {\n    System.out.println(\"Lượt \" + i);\n}\n\nint count = 3;\nwhile (count > 0) {\n    System.out.println(count);\n    count--;\n}",
        "output": "Lượt 1\nLượt 2\nLượt 3\n3\n2\n1",
        "task": "Dùng vòng lặp for để tính tổng các số từ 1 đến 5.",
        "hint": "Tạo biến sum = 0, rồi cộng i vào sum trong mỗi lượt.",
        "solution": "int sum = 0;\nfor (int i = 1; i <= 5; i++) {\n    sum += i;\n}\nSystem.out.println(sum);"
      },
      {
        "title": "Phương thức và lớp",
        "intro": "Lớp là bản thiết kế cho đối tượng. Phương thức mô tả hành vi mà đối tượng hoặc lớp có thể thực hiện.",
        "body": [
          "class định nghĩa một kiểu dữ liệu do bạn tạo.",
          "Các biến bên trong lớp thường được gọi là field hoặc thuộc tính.",
          "Constructor khởi tạo đối tượng. Tên constructor giống tên lớp và không có kiểu trả về.",
          "Phương thức có kiểu trả về; dùng void nếu không trả về giá trị."
        ],
        "code": "class Learner {\n    String name;\n\n    Learner(String name) {\n        this.name = name;\n    }\n\n    void introduce() {\n        System.out.println(\"Xin chào, tôi là \" + name);\n    }\n}\n\nLearner learner = new Learner(\"An\");\nlearner.introduce();",
        "output": "Xin chào, tôi là An",
        "task": "Tạo lớp Book có field title và phương thức showTitle() để in tên sách.",
        "hint": "Viết constructor nhận title, gán this.title, rồi tạo phương thức void showTitle().",
        "solution": "class Book {\n    String title;\n    Book(String title) { this.title = title; }\n    void showTitle() { System.out.println(title); }\n}"
      }
    ]
  },
  {
    "id": "cpp",
    "name": "C++",
    "tag": "Hiệu năng và kiểm soát",
    "symbol": "C++",
    "color": "#6656d9",
    "level": "Trung cấp",
    "duration": "4 chương · 70–90 phút",
    "description": "Học cú pháp C++ hiện đại từ nhập xuất, điều kiện và vòng lặp đến hàm và vector.",
    "goal": "Viết chương trình console đơn giản và biết tổ chức xử lý dữ liệu bằng hàm.",
    "lessons": [
      {
        "title": "Biến và nhập xuất",
        "intro": "C++ là ngôn ngữ biên dịch. Một chương trình cơ bản thường dùng thư viện iostream để nhập và xuất dữ liệu.",
        "body": [
          "#include đưa khai báo từ thư viện vào chương trình.",
          "main là hàm bắt đầu thực thi trong chương trình console thông thường.",
          "int, double, char, bool và std::string là kiểu dữ liệu phổ biến.",
          "std::cout xuất dữ liệu; std::cin đọc dữ liệu từ đầu vào."
        ],
        "code": "#include <iostream>\n#include <string>\n\nint main() {\n    std::string learner = \"An\";\n    int lessonsDone = 3;\n\n    std::cout << learner << '\\n';\n    std::cout << lessonsDone << '\\n';\n    return 0;\n}",
        "output": "An\n3",
        "task": "Khai báo biến double price = 19.5 và in giá trị đó ra màn hình.",
        "hint": "Dùng std::cout << price << '\\n'; để in số và xuống dòng.",
        "solution": "double price = 19.5;\nstd::cout << price << '\\n';"
      },
      {
        "title": "Điều kiện và toán tử",
        "intro": "Câu lệnh điều kiện trong C++ giúp chương trình chọn nhánh dựa trên kết quả của một biểu thức.",
        "body": [
          "if, else if và else tạo các nhánh xử lý.",
          "Các phép so sánh gồm ==, !=, >, <, >= và <=.",
          "&&, || và ! lần lượt biểu diễn AND, OR và NOT.",
          "Dấu ngoặc nhọn giúp thể hiện rõ phạm vi khối lệnh."
        ],
        "code": "int score = 82;\n\nif (score >= 90) {\n    std::cout << \"Xuat sac\";\n} else if (score >= 70) {\n    std::cout << \"Dat\";\n} else {\n    std::cout << \"Can luyen them\";\n}",
        "output": "Dat",
        "task": "Kiểm tra số n. In “Chan” nếu n chia hết cho 2, ngược lại in “Le”.",
        "hint": "Dùng phép chia dư n % 2 == 0.",
        "solution": "if (n % 2 == 0) {\n    std::cout << \"Chan\";\n} else {\n    std::cout << \"Le\";\n}"
      },
      {
        "title": "Vòng lặp và mảng",
        "intro": "C++ cung cấp for, while và các kiểu chứa dữ liệu như std::array hoặc std::vector.",
        "body": [
          "for cổ điển cho phép kiểm soát chỉ số và điều kiện lặp.",
          "range-based for duyệt lần lượt các phần tử trong vùng dữ liệu.",
          "std::vector là mảng động có thể thay đổi kích thước.",
          "Khi dùng vector, thêm #include <vector>."
        ],
        "code": "#include <iostream>\n#include <vector>\n\nint main() {\n    std::vector<int> scores{8, 9, 10};\n    for (int score : scores) {\n        std::cout << score << '\\n';\n    }\n}",
        "output": "8\n9\n10",
        "task": "Tạo vector chứa 2, 4, 6 rồi duyệt và in từng phần tử.",
        "hint": "Dùng std::vector<int> numbers{2, 4, 6}; và range-based for.",
        "solution": "std::vector<int> numbers{2, 4, 6};\nfor (int number : numbers) {\n    std::cout << number << '\\n';\n}"
      },
      {
        "title": "Hàm và chia chương trình",
        "intro": "Hàm giúp đặt tên cho một thao tác, nhận tham số và trả kết quả. Đây là bước quan trọng để tránh một hàm main quá dài.",
        "body": [
          "Khai báo hàm gồm kiểu trả về, tên hàm và danh sách tham số.",
          "return gửi kết quả về nơi gọi. Hàm void không trả về giá trị.",
          "Tham số truyền theo giá trị tạo bản sao. Tham chiếu dùng & khi cần làm việc với đối tượng gốc.",
          "Đặt tên hàm theo hành động mà nó thực hiện."
        ],
        "code": "int add(int a, int b) {\n    return a + b;\n}\n\nint main() {\n    int total = add(7, 5);\n    std::cout << total << '\\n';\n    return 0;\n}",
        "output": "12",
        "task": "Viết hàm square nhận int n và trả về n * n.",
        "hint": "Kiểu trả về là int, tham số là int n, rồi return n * n.",
        "solution": "int square(int n) {\n    return n * n;\n}"
      }
    ]
  },
  {
    "id": "rust",
    "name": "Rust",
    "tag": "An toàn bộ nhớ và hiệu năng",
    "symbol": "Rs",
    "color": "#c46a35",
    "level": "Nâng cao",
    "duration": "4 chương · 80–100 phút",
    "description": "Làm quen let, kiểu dữ liệu, quyền sở hữu và cách viết hàm trong Rust.",
    "goal": "Hiểu những quy tắc nền tảng của Rust và đọc được chương trình console nhỏ.",
    "lessons": [
      {
        "title": "Biến và tính bất biến",
        "intro": "Rust mặc định coi biến khai báo bằng let là bất biến. Muốn thay đổi giá trị, bạn cần ghi rõ mut.",
        "body": [
          "let name = ... khai báo một binding bất biến.",
          "let mut count = ... cho phép gán lại giá trị sau đó.",
          "Rust thường suy luận kiểu từ giá trị khởi tạo, nhưng bạn cũng có thể ghi kiểu rõ ràng.",
          "println! là macro để in dữ liệu, thường dùng cú pháp format trong dấu ngoặc nhọn."
        ],
        "code": "fn main() {\n    let language = \"Rust\";\n    let mut lessons_done = 2;\n    lessons_done += 1;\n\n    println!(\"{}\", language);\n    println!(\"{}\", lessons_done);\n}",
        "output": "Rust\n3",
        "task": "Tạo biến mut score bắt đầu bằng 10, cộng thêm 5 rồi in kết quả.",
        "hint": "Dùng let mut score = 10; rồi score += 5;.",
        "solution": "let mut score = 10;\nscore += 5;\nprintln!(\"{}\", score);"
      },
      {
        "title": "Kiểu dữ liệu và điều kiện",
        "intro": "Rust có kiểu số, bool, char, tuple, array và nhiều kiểu dữ liệu được định nghĩa bởi lập trình viên.",
        "body": [
          "Các kiểu số nguyên gồm i32, i64, u32...; số thực thường gặp là f32 và f64.",
          "if là một biểu thức, vì vậy các nhánh có thể trả về giá trị.",
          "Rust yêu cầu các nhánh của một biểu thức if tương thích kiểu.",
          "Dấu chấm phẩy kết thúc một câu lệnh; biểu thức cuối khối không có dấu chấm phẩy có thể trở thành giá trị trả về."
        ],
        "code": "fn main() {\n    let score = 82;\n    let result = if score >= 70 {\n        \"Dat\"\n    } else {\n        \"Can luyen them\"\n    };\n    println!(\"{}\", result);\n}",
        "output": "Dat",
        "task": "Tạo biểu thức if gán “Chan” hoặc “Le” cho biến label dựa trên n % 2.",
        "hint": "Điều kiện số chẵn là n % 2 == 0. Hai nhánh trả về cùng kiểu &str.",
        "solution": "let label = if n % 2 == 0 { \"Chan\" } else { \"Le\" };"
      },
      {
        "title": "Vòng lặp và iterator",
        "intro": "Rust có loop, while, for và iterator. for thường là cách rõ ràng để duyệt qua một dãy hoặc collection.",
        "body": [
          "for item in collection duyệt lần lượt phần tử.",
          "1..4 là range gồm 1, 2, 3; 1..=4 bao gồm cả 4.",
          "while lặp khi điều kiện đúng.",
          "loop chạy vô hạn cho đến khi gặp break; break có thể mang theo giá trị."
        ],
        "code": "fn main() {\n    for number in 1..=3 {\n        println!(\"{}\", number);\n    }\n\n    let mut count = 2;\n    while count > 0 {\n        println!(\"count: {}\", count);\n        count -= 1;\n    }\n}",
        "output": "1\n2\n3\ncount: 2\ncount: 1",
        "task": "Dùng for với range để in các số từ 2 đến 5.",
        "hint": "Range bao gồm điểm cuối dùng cú pháp 2..=5.",
        "solution": "for number in 2..=5 {\n    println!(\"{}\", number);\n}"
      },
      {
        "title": "Hàm và quyền sở hữu cơ bản",
        "intro": "Quyền sở hữu là một quy tắc cốt lõi của Rust, giúp quản lý vòng đời dữ liệu mà không cần garbage collector.",
        "body": [
          "Mỗi giá trị có một chủ sở hữu tại một thời điểm.",
          "Khi chủ sở hữu ra khỏi scope, giá trị thường được giải phóng.",
          "Gán một String sang biến khác có thể chuyển quyền sở hữu (move). Kiểu số đơn giản như i32 thường Copy.",
          "Tham chiếu & cho phép mượn dữ liệu mà không lấy quyền sở hữu. Đây chỉ là phần nhập môn; borrow checker còn nhiều quy tắc cần học tiếp."
        ],
        "code": "fn length_of(text: &String) -> usize {\n    text.len()\n}\n\nfn main() {\n    let message = String::from(\"Hello\");\n    let size = length_of(&message);\n\n    println!(\"{}\", size);\n    println!(\"{}\", message);\n}",
        "output": "5\nHello",
        "task": "Viết hàm double nhận i32 và trả về giá trị nhân đôi. Gọi hàm với 6.",
        "hint": "Khai báo fn double(value: i32) -> i32 rồi trả về value * 2.",
        "solution": "fn double(value: i32) -> i32 {\n    value * 2\n}\n\nfn main() {\n    println!(\"{}\", double(6));\n}"
      }
    ]
  },
  {
    "id": "sql",
    "name": "SQL",
    "tag": "Truy vấn dữ liệu",
    "symbol": "SQL",
    "color": "#119d82",
    "level": "Cơ bản",
    "duration": "4 chương · 45–65 phút",
    "description": "Học cách đọc, lọc, sắp xếp và kết hợp dữ liệu trong bảng bằng các câu truy vấn SQL.",
    "goal": "Viết truy vấn SELECT có WHERE, ORDER BY, hàm tổng hợp và JOIN.",
    "lessons": [
      {
        "title": "SELECT và FROM",
        "intro": "SQL là ngôn ngữ truy vấn dữ liệu. SELECT chọn cột cần xem, FROM chỉ định bảng chứa dữ liệu.",
        "body": [
          "SELECT * lấy tất cả cột; nên chọn tên cột cụ thể khi biết dữ liệu cần dùng.",
          "FROM cho biết bảng nguồn.",
          "Có thể đặt bí danh cho cột bằng AS để tên kết quả dễ đọc hơn.",
          "SQL thường không phân biệt chữ hoa chữ thường với từ khóa, nhưng viết hoa từ khóa giúp dễ quan sát."
        ],
        "code": "SELECT name, level\nFROM courses;",
        "output": "name          | level\n--------------|--------\nHTML          | Beginner\nPython        | Beginner\nJavaScript    | Beginner",
        "task": "Viết truy vấn lấy hai cột title và duration từ bảng lessons.",
        "hint": "SELECT title, duration FROM lessons; là đủ cho yêu cầu này.",
        "solution": "SELECT title, duration\nFROM lessons;"
      },
      {
        "title": "WHERE và điều kiện lọc",
        "intro": "WHERE lọc các hàng theo điều kiện. Đây là cách thu hẹp kết quả trước khi hiển thị.",
        "body": [
          "Dùng =, <>, >, <, >= và <= để so sánh giá trị.",
          "AND yêu cầu tất cả điều kiện đúng; OR chỉ cần một điều kiện đúng.",
          "LIKE hỗ trợ tìm mẫu chuỗi; dấu % đại diện cho chuỗi ký tự bất kỳ.",
          "IS NULL dùng để kiểm tra giá trị null. Không dùng = NULL."
        ],
        "code": "SELECT title, views\nFROM lessons\nWHERE views >= 100\n  AND published = TRUE;",
        "output": "title            | views\n-----------------|------\nVariables        | 320\nLoops            | 180",
        "task": "Lấy tên các khóa học có level bằng 'Beginner'.",
        "hint": "Thêm WHERE level = 'Beginner' sau dòng FROM courses.",
        "solution": "SELECT name\nFROM courses\nWHERE level = 'Beginner';"
      },
      {
        "title": "ORDER BY, LIMIT và hàm tổng hợp",
        "intro": "SQL có thể sắp xếp kết quả, giới hạn số hàng và tính toán trên nhiều hàng.",
        "body": [
          "ORDER BY sắp xếp theo một hoặc nhiều cột. ASC là tăng dần; DESC là giảm dần.",
          "LIMIT giới hạn số hàng trả về trong nhiều hệ quản trị phổ biến.",
          "COUNT(), SUM(), AVG(), MIN() và MAX() là các hàm tổng hợp quen thuộc.",
          "GROUP BY nhóm các hàng có cùng giá trị để tính toán theo từng nhóm."
        ],
        "code": "SELECT category, COUNT(*) AS total\nFROM lessons\nGROUP BY category\nORDER BY total DESC\nLIMIT 5;",
        "output": "category       | total\n----------------|------\nWeb             | 12\nProgramming     | 9\nDatabase        | 5",
        "task": "Lấy 3 bài học có số lượt xem cao nhất từ bảng lessons.",
        "hint": "Dùng ORDER BY views DESC rồi LIMIT 3.",
        "solution": "SELECT title, views\nFROM lessons\nORDER BY views DESC\nLIMIT 3;"
      },
      {
        "title": "JOIN và kết hợp bảng",
        "intro": "JOIN ghép các hàng từ nhiều bảng dựa trên mối quan hệ giữa chúng.",
        "body": [
          "INNER JOIN chỉ giữ hàng có bản ghi khớp ở cả hai bảng.",
          "LEFT JOIN giữ tất cả hàng từ bảng bên trái, kể cả khi không có bản ghi khớp bên phải.",
          "ON mô tả điều kiện nối, thường là khóa chính với khóa ngoại.",
          "Dùng bí danh bảng như c và l để câu truy vấn ngắn và dễ đọc hơn."
        ],
        "code": "SELECT c.name, l.title\nFROM courses AS c\nINNER JOIN lessons AS l\n  ON l.course_id = c.id\nORDER BY c.name, l.title;",
        "output": "name       | title\n-----------|------------------\nHTML       | Forms\nHTML       | Page structure\nPython     | Conditions\nPython     | Variables",
        "task": "Kết hợp bảng students và enrollments qua students.id = enrollments.student_id để lấy tên học viên và khóa học.",
        "hint": "Đặt alias s cho students, e cho enrollments, sau đó INNER JOIN bằng khóa liên quan.",
        "solution": "SELECT s.name, e.course_name\nFROM students AS s\nINNER JOIN enrollments AS e\n  ON e.student_id = s.id;"
      }
    ]
  }
];
