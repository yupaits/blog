# yutool-file-server文件服务

## 快速上手

### 1. Maven依赖

在项目的 `pom.xml` 中添加以下依赖：

```xml
<parent>
    <groupId>com.yupaits</groupId>
    <artifactId>yutool-parent</artifactId>
    <version>${yutool.version}</version>
    <relativePath/>
</parent>

<dependencies>
    <dependency>
        <groupId>com.yupaits</groupId>
        <artifactId>yutool-file-server</artifactId>
    </dependency>
</dependencies>
```

### 2. 配置文件

在项目的配置文件 `application.yml` 中添加以下配置：

```yml
# 文件服务配置
file-server:
  # type可选项有: minio
  type: minio
  minio:
    endpoint:
    accessKey:
    secretKey:
```

### 3. 编写文件上传下载Controller【参考】

在项目中编写文件上传下载Controller：

```java
/**
 * 文件接口
 * @author yupaits
 * @since 2019/8/2
 */
@RestController
@RequestMapping("/upload/{storeGroup}")
@RequiredArgsConstructor
@ConditionalOnBean(annotation = EnableFileServer.class)
public class FileController {
    private static final String UPLOAD_PATH_PREFIX = "/upload/";

    private final UploadTemplate uploadTemplate;
    private final DownloadTemplate downloadTemplate;
    private final DeleteTemplate deleteTemplate;

    /**
     * 上传文件并返回访问路径
     * @param file 上传的文件
     * @param storeGroup 文件存储分组
     * @return 文件的访问链接
     */
    @ActionLog(value = "上传文件", level = ActionLog.ActionLogLevel.MIDDLE)
    @PostMapping("")
    public Result<String> upload(@RequestParam("file") MultipartFile file, @PathVariable String storeGroup) {
        UploadProps uploadProps = new UploadProps();
        uploadProps.setStoreGroup(storeGroup);
        return Result.ok(uploadTemplate.upload(file, uploadProps));
    }

    /**
     * 批量上传文件并返回访问路径
     * @param files 上传的文件
     * @param storeGroup 文件存储分组
     * @return 文件的访问链接
     */
    @ActionLog(value = "批量上传文件", level = ActionLog.ActionLogLevel.MIDDLE)
    @PostMapping("/batch")
    public Result<Map<String, String>> uploadBatch(@RequestParam("files")List<MultipartFile> files, @PathVariable String storeGroup){
        UploadProps uploadProps = new UploadProps();
        uploadProps.setStoreGroup(storeGroup);
        return Result.ok(uploadTemplate.uploadBatch(files, uploadProps));
    }

    /**
     * 上传图片并返回访问路径
     * @param image 上传的图片
     * @param storeGroup 文件存储分组
     * @param uploadProps 文件上传配置参数
     * @return 图片的访问链接
     */
    @ActionLog(value = "上传图片", level = ActionLog.ActionLogLevel.MIDDLE)
    @PostMapping("/image")
    public Result<String> uploadImage(@RequestParam("image") MultipartFile image,
                                      @PathVariable String storeGroup,
                                      UploadProps uploadProps){
        uploadProps.setStoreGroup(storeGroup);
        return Result.ok(uploadTemplate.uploadImage(image, uploadProps));
    }

    /**
     * 批量上传图片并返回访问路径
     * @param images 上传的图片文件列表
     * @param storeGroup 文件存储分组
     * @param uploadProps 文件上传配置参数
     * @return 图片访问链接列表
     */
    @ActionLog(value = "批量上传图片", level = ActionLog.ActionLogLevel.MIDDLE)
    @PostMapping("/image/batch")
    public Result<Map<String, String>> uploadBatchImage(@RequestParam("images")List<MultipartFile> images,
                                                        @PathVariable String storeGroup,
                                                        UploadProps uploadProps){
        uploadProps.setStoreGroup(storeGroup);
        return Result.ok(uploadTemplate.uploadBatchImage(images, uploadProps));
    }

    /**
     * 下载文件
     * @param request HttpServletRequest
     * @param response HttpServletResponse
     * @param downloadProps 文件下载配置参数
     * @throws IOException 抛出IOException
     */
    @ActionLog(value = "下载文件", level = ActionLog.ActionLogLevel.MIDDLE)
    @GetMapping("/**")
    public void download(HttpServletRequest request, HttpServletResponse response, DownloadProps downloadProps) throws IOException {
        String fullPath = StringUtils.substringAfter(request.getRequestURI(), UPLOAD_PATH_PREFIX);
        downloadTemplate.downloadFile(response, fullPath, downloadProps);
    }

    /**
     * 删除文件
     * @param request HttpServletRequest
     * @return 处理结果
     */
    @ActionLog(value = "删除文件", level = ActionLog.ActionLogLevel.HIGH)
    @DeleteMapping("/**")
    public Result delete(HttpServletRequest request) {
        String fullPath = StringUtils.substringAfter(request.getRequestURI(), UPLOAD_PATH_PREFIX);
        deleteTemplate.deleteFile(fullPath);
        return Result.ok();
    }
}
```

## 文件防盗链【可选】

在项目中编写 `AntiTheftService` 的实现类并注册为 `@Servcie` Bean。

```java
@Service
public class AntiTheftServiceImpl implements AntiTheftService {
    @Override
    public boolean check(HttpServletRequest request, HttpServletResponse response) {
        // 防盗链校验处理，一般使用白名单实现
        return false;
    }
}
```

## 文件访问权限校验【可选】

在项目中编写 `FileAccessService` 的实现类并注册为 `@Servcie` Bean。

```java
@Service
public class FileAccessServiceImpl implements FileAccessService {
    @Override
    public boolean checkAccess(HttpServletRequest request, HttpServletResponse response) {
        // 权限校验处理
        return false;
    }
}
```
