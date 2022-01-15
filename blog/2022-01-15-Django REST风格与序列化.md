---
slug: Django-rest
title: Django REST风格与序列化
authors: LLmoskk
tags: [python, Django]
---

# Django REST 风格与序列化

### 1.安装

```
pip install djangorestframework==3.10.3
pip install django-filter==2.2.0
```

<!--truncate-->

### 2.编写 models 及迁移

```python
from django.db import models

# Create your models here.
class Article(models.Model):
     title = models.CharField(max_length=10)
     desc = models.CharField(max_length=100)

     class Meta:
         db_table = 'articles'
```

### 3.创建 serializers 文件（序列化文件）

```python
from rest_framework import serializers

from drfapp.models import Article


class ArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article   # 关联的模型
        fields = ['id','title','desc']  # 要拆分的字段
```

序列化文件就是用来拆解 model 的，客户端需要什么字段写什么

### 4.编写视图集类

```python
from rest_framework import viewsets,mixins
from drfapp.models import Article
from drfapp.serializers import ArticleSerializer

class ArticleViewSet(viewsets.GenericViewSet,
                  mixins.ListModelMixin,
                  mixins.RetrieveModelMixin,
                  mixins.DestroyModelMixin,
                  mixins.CreateModelMixin,
                  mixins.UpdateModelMixin):
       queryset = Article.objects.all()  # 提供查询结果集
       serializer_class = ArticleSerializer  # 关联序列化类
```

### 5.编写子路由

```python
from rest_framework.routers import SimpleRouter
from drfapp.views import ArticleViewSet

router = SimpleRouter()
router.register(r'articles',ArticleViewSet)
```

### 6.编写总路由模块

```python
urlpatterns = [
    path('app/',include(router.urls))  # 关联前缀路由与子路由模块中的router对象
]
```

---

### 遇到的问题

说是找不到 rest_framework

![image-20210519163529924](https://gitee.com/hjy2000/pic/raw/master/image-20210519163529924.png)

解决办法是在 setting 文件中注册 rest_framework

![image-20210519163700818](https://gitee.com/hjy2000/pic/raw/master/image-20210519163700818.png)

之后就可以成功进入了

![image-20210519163730517](https://gitee.com/hjy2000/pic/raw/master/image-20210519163730517.png)
