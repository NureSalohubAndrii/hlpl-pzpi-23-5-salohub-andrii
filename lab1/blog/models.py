from django.db import models
from django.contrib.auth.models import User


# Create your models here.
class Category(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    description = models.TextField()

    def __str__(self):
        return self.name


class Article(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255)
    content = models.TextField()
    publish_date = models.DateTimeField(auto_now_add=True)

    category = models.ForeignKey(
        Category, on_delete=models.CASCADE, related_name="articles"
    )

    def __str__(self):
        return self.title


class Comment(models.Model):
    id = models.AutoField(primary_key=True)

    text = models.TextField()
    posted_at = models.DateTimeField(auto_now_add=True)

    author = models.ForeignKey(User, on_delete=models.CASCADE)
    article = models.ForeignKey(
        Article, on_delete=models.CASCADE, related_name="comments"
    )

    def __str__(self):
        return f"Commented by {self.author} on {self.article}"
