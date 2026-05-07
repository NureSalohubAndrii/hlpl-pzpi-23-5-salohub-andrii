from django.shortcuts import redirect, render
from blog.models import Article, Comment
from django.core.paginator import Paginator
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import login
from django.contrib.auth.decorators import login_required

from .forms import ArticleForm, CommentForm


# Create your views here.
def signup(request):
    if request.method == "POST":
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect("article_list")
    else:
        form = UserCreationForm()

    return render(request, "signup.html", {"form": form})


def articles_list(request):
    query = request.GET.get("q")

    if query:
        articles = Article.objects.filter(title__icontains=query)
    else:
        articles = Article.objects.all()

    paginator = Paginator(articles, 5)
    page_number = request.GET.get("page")
    page_obj = paginator.get_page(page_number)

    return render(request, "list.html", {"page_obj": page_obj})


def create_article(request):
    if request.method == "POST":
        form = ArticleForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect("article_list")
    else:
        form = ArticleForm()

    return render(request, "create_article.html", {"form": form})


def article_details(request, article_id):
    article = Article.objects.filter(id=article_id).first()
    comments = article.comments.all().order_by("-posted_at")

    if request.method == "POST":
        if not request.user.is_authenticated:
            return redirect("login")

        form = CommentForm(request.POST)
        if form.is_valid():
            comment = form.save(commit=False)
            comment.article = article
            comment.author = request.user
            comment.save()
            return redirect("article_details", article_id=article.id)
    else:
        form = CommentForm()

    return render(
        request,
        "article_details.html",
        {"article": article, "comments": comments, "form": form},
    )


@login_required
def delete_comment(request, comment_id):
    comment = Comment.objects.filter(id=comment_id).first()
    article_id = comment.article.id

    if comment.author == request.user:
        comment.delete()

    return redirect("article_details", article_id=article_id)
