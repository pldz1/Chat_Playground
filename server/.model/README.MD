# 项目离线模型资源使用笔记

## Tiktoken model 离线使用

### 配置 Blobpath 变量

1. 设置 `blobpath` 变量为以下 URL：

   ```python
   blobpath = "https://openaipublic.blob.core.windows.net/encodings/cl100k_base.tiktoken"
   ```

2. 点击链接下载文件 `cl100k_base.tiktoken`，确保在联网的服务器上完成此操作。

---

### 获取 `cache_key` 并重命名文件

1. 使用以下代码生成 `cache_key`：

   ```python
   import hashlib

   # 定义 blobpath
   blobpath = "your_blob_url_here"
   cache_key = hashlib.sha1(blobpath.encode()).hexdigest()
   print(cache_key)
   ```

2. 示例输出：

   ```
   9b5ad71b2ce5302211f9c61530b329a4922fc6a4
   ```

3. 将下载的文件 `cl100k_base.tiktoken` 重命名为生成的 `cache_key` 值，例如：
   ```
   9b5ad71b2ce5302211f9c61530b329a4922fc6a4
   ```

---

### 引入缓存库的代码修改

1. 增加以下代码，设置 `tiktoken_cache_dir` 变量，并将重命名后的文件移动到该目录下：

   ```python
   import os
   import tiktoken

   # 自定义缓存目录路径
   tiktoken_cache_dir = "path_to_folder_containing_tiktoken_file"
   os.environ["TIKTOKEN_CACHE_DIR"] = tiktoken_cache_dir
   ```

2. 示例中，`tiktoken_cache_dir` 的路径为：

   ```
   '/home/workspace'
   ```

3. 确保文件结构如下：
   ```
   path_to_folder_containing_tiktoken_file/
   └── 9b5ad71b2ce5302211f9c61530b329a4922fc6a4
   ```

---

### 总结

1. 下载 `cl100k_base.tiktoken` 文件。
2. 根据 `blobpath` 生成 `cache_key` 并重命名文件。
3. 设置缓存目录，将文件放置其中。
4. 在代码中配置 `TIKTOKEN_CACHE_DIR` 环境变量，引入缓存库。

至此，文件和变量已配置完成，程序可正常运行。
