# Giới thiệu

VNP Framework được tạo ra bởi những con người yêu thích công nghệ. Chúng tôi yêu thích những dòng code, những công nghệ mới nhất hiện nay, với niềm đam mê này chúng tôi mong muốn mang đến cho bạn một Framework trong sáng, dễ  dùng và sự hứng thú trong mỗi dòng code.

Đặc biệt với cách viết OOP kết hợp một chút helper sẽ đem lại một trải nghiệm thú vị :)

# Hướng dẫn sử dụng

- Tạo 1 project mới

        composer global config repositories.0 vcs ssh://git@gitlab.hoidap.vn:2012/vnp-framework/installer.git
        
        //Nếu chạy trên server hoặc trong docker container với user root thì chạy như sau:
        COMPOSER_ALLOW_SUPERUSER=1 composer global config repositories.0 vcs ssh://git@gitlab.hoidap.vn:2012/vnp-framework/installer.git

        composer global require vatgia/installer

        vnp-framework new project_name
        
        //Nếu tạo tại thư mục hiện tại
        
        cd exists_directory
        vnp-framework new .
        
        //Nếu có lỗi báo ```bash: vnp-framework: command not found```
        ~/.composer/vendor/bin/vnp-framework new .
        

- [Cấu trúc thư mục](folder-structure.md)
- [Luồng đi của Request](request-cycle.md)
- [Config](config.md)
- [Routes](routes.md)
- [Controllers](controllers.md)
- [Views](views.md)
- [Database Migrations](database.md)
- [Model](models.md)
- [Collection](collection.md)
- [Validator](validator.md)
- [Upload File && Resize Image](upload_resize.md)
- [Flash Message](flash_message.md)
- [Admin](admin.md)
- [Queue](queue.md)
- [API](api.md)

# Quy trình làm việc

Tham khảo: https://viblo.asia/p/gioi-thieu-mot-mo-hinh-su-dung-git-branches-hieu-qua-ZabG9zy4vzY6

[![N|Solid](http://nvie.com/img/git-model@2x.png)](http://nvie.com/img/git-model@2x.png)

Repo trung tâm sẽ chứa hai branches chính hoạt động mãi mãi:

  - master
  - develop (Hoặc dev)

`origin/master` được coi là nhánh chính với HEAD phản ánh trạng thái production-ready.

`origin/develop` được coi là nhánh chính với HEAD phản ánh trạng thái thay đổi mới nhất trong quá trình phát triển, chuẩn bị cho release tiếp theo.

Khi source code bên `develop` đạt đến một mức độ ổn định nào đó và sẵn sàng để release thì sẽ được merge sang bên `master` và đánh dấu với release number.

Như vậy, theo định nghĩa về nhánh `master`, chúng ta mặc định hiểu rằng khi có thay đổi được merge vào master thì tức là sẽ có một phiên bản production mới được release. Nhờ đó chúng ta có thể sử dụng script để tự động build lên production server mỗi khi có commit ở master.

## Những branch phụ

Bên cạnh hai branches chính master và develop, mô hình mà tôi đang sử dụng còn có thêm rất nhiều những branches phụ để giúp các team members có thể phát triển song song, dễ dàng tracking theo features, chuẩn bị cho release hoặc fix nhanh các vấn đề production. Khác với hai branches chính kia, các branches phụ này chỉ tồn tại trong một khoảng thời gian ngắn, rồi sẽ bị xoá đi.

- Feature branches
- Release branches
- Hotfix branches

Phía trên là các loại branches khác nhau tôi hay sử dụng. Mỗi loại branches lại có một nhiệm vụ riêng, và cách xử lý riêng. Tôi sẽ đi sâu vào phân tích ở đoạn sau.

Về mặt kỹ thuật, chả có branch nào là "đặc biệt" so với các branches khác cả. Tất cả chỉ là Git branches thông thường, chúng chỉ được phân loại bằng cách ta sử dụng ra sao thôi.

### Feature branches

- Tách từ: develop
- Merge vào: develop
- Naming convention: tự do, ngoại trừ master, develop, release-*, hotfix-* .

[![N|Solid](http://nvie.com/img/fb@2x.png)](http://nvie.com/img/fb@2x.png)


### Release branches

- Tách từ: develop
- Merge vào: develop và master
- Naming convention: release-*


#### Kết thúc release branch

Khi source code trên release branch sẵn sàng để release, đầu tiên, phải merge vào master, sau đó phải đc merge lại vào develop để những lần release sau cũng chứa những thay đổi ở lần này.

### Hotfix branches

- Tách từ: master
- Merge vào: develop và master
- Naming convention: hotfix-*


Hotfix branches cũng giống release branches ở chỗ được sử dụng để chuẩn bị cho việc release production mới, chỉ khác ở chỗ là ko có plan từ trước. Khi có một bug nghiêm trọng trên bản production cần được giải quyết ngay lập tức, một hotfix branch sẽ được tách ra từ master và được đánh version để nhận biết.

Ưu điểm của việc tách nhánh này ở chỗ các team members khác có thể tiếp tục công việc ở develop trong khi những người khác có thể tập trung vào fix bug của production.

Tuy nhiên, có một điểm cần lưu ý rằng: khi đang tồn tại một release branch thì cần phải merge hotfix vào release branch đó, thay cho develop. Khi release branch được merge vào develop thì cuối cùng những thay đổi trong hotfix cũng được merge vào develop, nên không có vấn đề gì cả. Trừ khi thực sự công việc ở develop cần phần hotfix ngay lập tức và ko thể đợi release branch được merge, thì cần cẩn thận merge hotfix vào develop.