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
  # type可选项有: fastdfs、minio
  type: fastdfs
  minio:
    endpoint:
    accessKey:
    secretKey:

# FastDFS配置
fdfs:
  so-timeout: 1501
  connect-timeout: 601
  tracker-list:
    - localhost:22122
```

### 3. 编写文件上传下载Controller【参考】

在项目中编写文件上传下载Controller：

```java
@RestController
@RequestMapping("/upload/{storeGroup}")
@Api(tags = "文件接口")
public class FileController {
    private static final String UPLOAD_PATH_PREFIX = "/upload/";
    private static final String PATH_SEPARATOR = "/";

    private final UploadTemplate uploadTemplate;
    private final DownloadTemplate downloadTemplate;
    private final DeleteTemplate deleteTemplate;

    @Autowired
    public FileController(UploadTemplate uploadTemplate, DownloadTemplate downloadTemplate, DeleteTemplate deleteTemplate) {
        this.uploadTemplate = uploadTemplate;
        this.downloadTemplate = downloadTemplate;
        this.deleteTemplate = deleteTemplate;
    }

    @ApiOperation("上传文件并返回访问路径")
    @PostMapping("")
    public Result<String> upload(@RequestParam("file") MultipartFile file,
                                 @ApiParam(value = "文件存储分组", required = true) @PathVariable String storeGroup) throws UploadException {
        UploadProps uploadProps = new UploadProps();
        uploadProps.setStoreGroup(storeGroup);
        return uploadTemplate.resultUpload(file, uploadProps);
    }

    @ApiOperation("批量上传文件并返回访问路径")
    @PostMapping("/batch")
    public Result<Map<String, String>> uploadBatch(@RequestParam("files")List<MultipartFile> files,
                                                   @ApiParam(value = "文件存储分组", required = true) @PathVariable String storeGroup) throws UploadException {
        UploadProps uploadProps = new UploadProps();
        uploadProps.setStoreGroup(storeGroup);
        return uploadTemplate.resultUploadBatch(files, uploadProps);
    }

    @ApiOperation("上传图片并返回访问路径")
    @PostMapping("/image")
    public Result<String> uploadImage(@RequestParam("image") MultipartFile image,
                                      @ApiParam(value = "文件存储分组", required = true) @PathVariable String storeGroup,
                                      @ApiParam("是否保存缩略图") @RequestParam(required = false, defaultValue = "false") boolean thumb,
                                      @ApiParam("缩略图宽度") @RequestParam(required = false, defaultValue = "0") int width,
                                      @ApiParam("缩略图高度") @RequestParam(required = false, defaultValue = "0") int height,
                                      @ApiParam("图片缩放比例") @RequestParam(required = false, defaultValue = "1.0") double scale,
                                      @ApiParam("是否附带水印") @RequestParam(required = false, defaultValue = "false") boolean withWatermark,
                                      @ApiParam("水印类型") @RequestParam(required = false) WatermarkType watermarkType,
                                      @ApiParam("水印文件路径") @RequestParam(required = false) String watermarkPic,
                                      @ApiParam("水印文字") @RequestParam(required = false) String watermarkText,
                                      @ApiParam("水印透明度（取值范围0-1，0表示完全透明）") @RequestParam(required = false, defaultValue = "1.0") float watermarkOpacity,
                                      @ApiParam("水印位置") @RequestParam(required = false) Positions watermarkPos) throws UploadException {
        UploadProps uploadProps = UploadProps.builder()
                .storeGroup(storeGroup)
                .thumb(thumb)
                .width(width)
                .height(height)
                .scale(scale)
                .withWatermark(withWatermark)
                .watermarkType(watermarkType)
                .watermarkPic(watermarkPic)
                .watermarkText(watermarkText)
                .watermarkOpacity(watermarkOpacity)
                .watermarkPos(watermarkPos)
                .build();
        return uploadTemplate.resultUploadImage(image, uploadProps);
    }

    @ApiOperation("批量上传图片并返回访问路径")
    @PostMapping("/image/batch")
    public Result<Map<String, String>> uploadBatchImage(@RequestParam("images")List<MultipartFile> images,
                                                        @ApiParam(value = "文件存储分组", required = true) @PathVariable String storeGroup,
                                                        @ApiParam("是否保存缩略图") @RequestParam(required = false, defaultValue = "false") boolean thumb,
                                                        @ApiParam("缩略图宽度") @RequestParam(required = false, defaultValue = "0") int width,
                                                        @ApiParam("缩略图高度") @RequestParam(required = false, defaultValue = "0") int height,
                                                        @ApiParam("图片缩放比例") @RequestParam(required = false, defaultValue = "1.0") double scale,
                                                        @ApiParam("是否附带水印") @RequestParam(required = false, defaultValue = "false") boolean withWatermark,
                                                        @ApiParam("水印类型") @RequestParam(required = false) WatermarkType watermarkType,
                                                        @ApiParam("水印文件路径") @RequestParam(required = false) String watermarkPic,
                                                        @ApiParam("水印文字") @RequestParam(required = false) String watermarkText,
                                                        @ApiParam("水印透明度（取值范围0-1，0表示完全透明）") @RequestParam(required = false, defaultValue = "1.0") float watermarkOpacity,
                                                        @ApiParam("水印位置") @RequestParam(required = false) Positions watermarkPos) throws UploadException {
        UploadProps uploadProps = UploadProps.builder()
                .storeGroup(storeGroup)
                .thumb(thumb)
                .width(width)
                .height(height)
                .scale(scale)
                .withWatermark(withWatermark)
                .watermarkType(watermarkType)
                .watermarkPic(watermarkPic)
                .watermarkText(watermarkText)
                .watermarkOpacity(watermarkOpacity)
                .watermarkPos(watermarkPos)
                .build();
        return uploadTemplate.resultUploadBatchImage(images, uploadProps);
    }

    @ApiOperation("下载文件")
    @GetMapping("/**")
    public void download(HttpServletRequest request, HttpServletResponse response,
                         @ApiParam("是否下载缩略图") @RequestParam(required = false, defaultValue = "false") boolean thumb,
                         @ApiParam("缩略图宽度") @RequestParam(required = false, defaultValue = "0") int width,
                         @ApiParam("缩略图高度") @RequestParam(required = false, defaultValue = "0") int height,
                         @ApiParam("图片质量（压缩比，如0.8表示压缩比为80%）") @RequestParam(required = false, defaultValue = "1.0") float quality,
                         @ApiParam("图片缩放比例") @RequestParam(required = false, defaultValue = "1.0") double scale,
                         @ApiParam("是否附带水印") @RequestParam(required = false, defaultValue = "false") boolean withWatermark,
                         @ApiParam("水印类型") @RequestParam(required = false) WatermarkType watermarkType,
                         @ApiParam("水印文件路径") @RequestParam(required = false) String watermarkPic,
                         @ApiParam("水印文字") @RequestParam(required = false) String watermarkText,
                         @ApiParam("水印透明度（取值范围0-1，0表示完全透明）") @RequestParam(required = false, defaultValue = "1.0") float watermarkOpacity,
                         @ApiParam("水印位置") @RequestParam(required = false) Positions watermarkPos) throws IOException, DownloadException {
        DownloadProps downloadProps = DownloadProps.builder()
                .thumb(thumb)
                .width(width)
                .height(height)
                .quality(quality)
                .scale(scale)
                .withWatermark(withWatermark)
                .watermarkType(watermarkType)
                .watermarkPic(watermarkPic)
                .watermarkText(watermarkText)
                .watermarkOpacity(watermarkOpacity)
                .watermarkPos(watermarkPos)
                .build();
        String fullPath = StringUtils.substringAfter(StringUtils.substringAfter(request.getRequestURI(), UPLOAD_PATH_PREFIX), PATH_SEPARATOR);
        downloadTemplate.downloadFile(response, fullPath, downloadProps);
    }

    @ApiOperation("删除文件")
    @DeleteMapping("/**")
    public Result delete(HttpServletRequest request) throws DeleteException {
        String fullPath = StringUtils.substringAfter(StringUtils.substringAfter(request.getRequestURI(), UPLOAD_PATH_PREFIX), PATH_SEPARATOR);
        deleteTemplate.deleteFile(fullPath);
        return ResultWrapper.success();
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
