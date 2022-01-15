---
slug: Django-mySql
title: Django链接mysql数据库
authors: LLmoskk
tags: [python, Django, MySql]
---

# Django 链接 mysql 数据库

### 1.在控制台（可设置版本）

```
pip install mysqlclient
```

<!--truncate-->

### 2.在 setting 文件中修改为对应的数据库

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}
```

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'mydb',
        'HOST':'localhost',
        'PORT':3306,
        'USER':'root',
        'PASSWORD':'root',
    }
}
```

### 3.在 models 文件中编写

```python
from django.db import models

# Create your models here.
class Student(models.Model):

    name = models.CharField(max_length=20)
    sex = models.CharField(max_length=10)
    score = models.FloatField()

    class Meta:
        db_table = "students"   #   指定模型类对应的表名称
```

### 4.迁移日志（在控制台）

```
python manage.py makemigrations

python manage.py migrate app名称
```

---

## 操作数据库

进入 python shell

```
python manage.py shell
```

插入方式一

```
>>> from mydbtest.models import Student
>>> stu1 = Student(name="张三",sex="男",score=99)
>>> stu1.save()
```

插入方式二（这个方法不用 save()了）

```
>>> stu2 = Student.objects.create(name="李四",sex="男",score=90)
>>> stu2
<Student: Student object (3)>
```

修改

```
>>> stu2.score = 60
>>> stu2.save()
```

删除

```
调用模型对象的delete()方法

删除表中全部数据
以学生模型为例：
Student.objects.all().delete()


删除多条记录：
Student.objects.filter(过滤条件).delete()
```

#### 查询

查询单条记录

```
>>> stu = Student.objects.get(id=1)
>>> stu.name
'张三'
get()方法只允许返回一条记录,否则报错

```

查询所有记录

```
students = Student.objects.all()
返回Django中的QuerySet对象，该对象是个容器对象，可以被遍历、切片、或者通过索引获取某个对象。
```

查询某个（些）字段

```
字典格式 value()
students = Student.objects.filter(score__gte=70).values('name','score')

元组格式 values_list()
students = Student.objects.filter(score__gte=70).values_list('name','score')
```

过滤查询

```
过滤查询操作：

1.查询性别为“男”的学生
students = Student.objects.filter(sex='男')
返回Django中的QuerySet容器

2.查询姓名为“令狐冲”，性别为“男”的学生
students = Student.objects.filter(sex='男',name="令狐冲")
```

魔法查询

```
字段后面跟双下划线"__"，表示特殊查询
常用的双下划线魔法参数有：
 __year     __month   __day   __startswith  __endswith    __gte  __lte  __gt  __lt  __contains (相当于模糊查询)

1. 名字中以"郭"开头的学生记录
  students = Student.objects.filter(name__startswith='郭')

2.名字中包含"郭"的学生记录
  students = Student.objects.filter(name__contains='郭')

3. 查询成绩大于等于85分的学生记录
  students = Student.objects.filter(score__gte=85)
```

限制查询

```
1.查询所有学生的第2、3记录
students = Student.objects.all()[1:3]

2.查询前两个男生
students = Student.objects.filter(sex="男")[:2]

3.查询所有学生的第1、3、5...条记录
students = Student.objects.all()[::2]
```

排序查询

```
1.对所有学生按照成绩降序排序
  students = Student.objects.order_by("-score")

2. 查询成绩为前三名的学生记录
   topstudents = Student.objects.order_by("-score")[:3]

还可以根据多个字段进行排序，比如：先根据成绩降序排序，如果成绩相等，则再根据年龄升序排序；
students = Student.objects.order_by("-score","age")

```

Q 查询

Q 查询指的就是把查询条件一个个的写出来然后通过 & 或者 | 组合来过滤查询

首先

```python
 from django.db.models import Q
```

```
1.使用Q查询男生中90分以上的学生记录
 q1 = Q(sex='男')
 q2 = Q(score__gte=90)
students = Student.objects.filter(q1&q2)

2. 使用Q查询姓“郭”或者成绩大于等于90分的学生记录
q1 = Q(name__startswith='郭')
q2 = Q(score__gte=90)
students = Student.objects.filter(q1|q2)

3.使用Q查询名字中不包含“郭”的学生
 q = Q(name__contains='郭')
 students = Student.objects.filter(~q)

```

F 查询

F 查询是指在数据库层级操作，只读取数据库中最新的数据来操作

```
from django.db.models import F
```

```
>>> stu = Student.objects.get(id=3)
>>> stu.name
'王五'   #此时数据库中为70
>>> stu.score = F("score") + 5
>>> stu.save()  #保存完成后为75
```

```
>>> stu = Student.objects.get(id=3)
>>> stu.name
'王五'   #此时修改数据库中为70-->30
>>> stu.score = F("score") + 5
>>> stu.save()  #保存完成后为35
```

聚合查询

就是可以使用 avg，sum 之类的函数了

```
1.查询所有学生的平均成绩：
avg_score = Student.objects.all().aggregate(Avg("score"))
结果是一个字典

还可以自定义结果字典的key:
avg_score = Student.objects.all().aggregate(avgscore=Avg("score"))

2.查询班级成绩最高的学生成绩
max_score = Student.objects.all().aggregate(scoremax=Max("score"))
或者：
max_score = Student.objects.aggregate(scoremax=Max("score"))

可能要导入的：from django.db.models import Min,Avg,Max,Sum,Count
```

分组查询

```
根据性别分组，查询男女生的平均成绩
students = Student.objects.values('sex').annotate(Avg('score'))

也可以自定义每组成绩的key
Student.objects.values("sex").annotate(stu_score=Avg("score"))
结果为：
<QuerySet [{'sex': '男', 'stu_score': 83.33333333333333}, {'sex': '女', 'stu_score': 68.0}]>

```
